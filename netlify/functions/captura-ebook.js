function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(payload)
  };
}

const MAX_BODY_BYTES = 10 * 1024;
const MIN_FORM_SECONDS = 3;
const FIELD_LIMITS = {
  nome: 120,
  email: 254,
  whatsapp: 20,
  utm_source: 150,
  utm_medium: 150,
  utm_campaign: 150,
  utm_content: 150,
  utm_term: 150,
  origem: 80,
  campanha: 150,
  pagina: 200,
  status_funil: 80
};

function getEnvValue(key, fallbackValue = "") {
  const value = process.env[key];

  if (value === undefined || value === null) {
    return fallbackValue;
  }

  return String(value)
    .trim()
    .replace(/^['"]|['"]$/g, "") || fallbackValue;
}

function sanitizeString(value = "") {
  return String(value).replace(/<[^>]*>/g, "").trim();
}

function sanitizeLimitedString(value = "", maxLength = 150) {
  return sanitizeString(value).slice(0, maxLength);
}

function normalizeEmail(value = "") {
  return sanitizeLimitedString(value, FIELD_LIMITS.email).toLowerCase();
}

function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(0, FIELD_LIMITS.whatsapp);
}

function getPhoneDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function getHeader(headers = {}, name = "") {
  const normalizedName = name.toLowerCase();
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === normalizedName);

  return entry ? String(entry[1]) : "";
}

function isBodyTooLarge(body = "") {
  return Buffer.byteLength(String(body || ""), "utf8") > MAX_BODY_BYTES;
}

function parseJsonBody(body = "") {
  try {
    return {
      ok: true,
      data: JSON.parse(body || "{}")
    };
  } catch (error) {
    return {
      ok: false,
      data: {}
    };
  }
}

function isRequiredFieldTooLong(value = "", maxLength = 120) {
  return sanitizeString(value).length > maxLength;
}

function isSuspiciousBotSubmission(body = {}) {
  if (sanitizeString(body.website)) {
    return true;
  }

  if (!body.form_started_at) {
    return false;
  }

  const startedAt = Number(body.form_started_at);

  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return false;
  }

  return Date.now() - startedAt < MIN_FORM_SECONDS * 1000;
}

function genericAcceptedResponse() {
  return jsonResponse(200, {
    success: true,
    message: "Lead salvo e ebook enviado.",
    redirect: "/ebook/obrigado.html"
  });
}

function normalizePublicUrl(value = "", fallbackUrl = "https://padraointerrompido.com.br/") {
  const rawValue = sanitizeString(value || fallbackUrl);
  const url = new URL(rawValue, "https://padraointerrompido.com.br");

  url.pathname = url.pathname.replace(/\/ebook\/ebook\//g, "/ebook/");

  return url.toString();
}

function withDefaultParams(urlValue, defaults = {}) {
  const url = new URL(urlValue, "https://padraointerrompido.com.br");

  Object.entries(defaults).forEach(([key, value]) => {
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

function normalizeBrevoPhone(phone = "") {
  const digits = normalizePhone(phone);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("55")) {
    return `+${digits}`;
  }

  return `+55${digits}`;
}

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitName(fullName = "") {
  const parts = sanitizeString(fullName).split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "Lead";
  const lastName = parts.join(" ");

  return {
    firstName,
    lastName
  };
}

function getOptionalNumberEnv(key) {
  const value = Number(getEnvValue(key));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function validateEnv() {
  const required = [
    "BREVO_API_KEY",
    "RESEND_API_KEY",
    "RESEND_FROM",
    "EBOOK_URL"
  ];

  const missing = required.filter((key) => !getEnvValue(key));

  if (missing.length > 0) {
    console.error("Variáveis de ambiente obrigatórias ausentes:", missing.join(", "));
    throw new Error("Configuração incompleta do servidor.");
  }
}

async function upsertContactBrevo(lead) {
  const { firstName, lastName } = splitName(lead.nome);
  const brevoPhone = normalizeBrevoPhone(lead.whatsapp);
  const listIds = [
    getOptionalNumberEnv("BREVO_LIST_ID_EBOOK")
  ].filter(Boolean);
  let lastBrevoFailure = null;

  function buildBrevoError(message, details) {
    const error = new Error(message);
    error.brevo = details || lastBrevoFailure;

    return error;
  }

  async function sendBrevoContact(payload, attemptName) {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": getEnvValue("BREVO_API_KEY"),
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      lastBrevoFailure = {
        attempt: attemptName,
        status: response.status,
        code: sanitizeLimitedString(data.code, 80),
        message: sanitizeLimitedString(data.message, 220)
      };

      console.error("Falha ao criar/atualizar contato no Brevo:", {
        attempt: lastBrevoFailure.attempt,
        status: lastBrevoFailure.status,
        code: lastBrevoFailure.code,
        message: lastBrevoFailure.message
      });

      return {
        ok: false,
        status: response.status,
        data
      };
    }

    return {
      ok: true,
      data
    };
  }

  async function addBrevoContactToLists() {
    if (listIds.length === 0) {
      return {
        ok: true,
        skipped: true,
        listIds: []
      };
    }

    const results = [];

    for (const listId of listIds) {
      const response = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`, {
        method: "POST",
        headers: {
          "api-key": getEnvValue("BREVO_API_KEY"),
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          emails: [lead.email]
        })
      });

      const data = await response.json().catch(() => ({}));
      const message = sanitizeLimitedString(data.message, 220);
      const alreadyInList = /already|ja esta|já está|already in list/i.test(message);

      if (!response.ok && !alreadyInList) {
        lastBrevoFailure = {
          attempt: "add_contact_to_list",
          status: response.status,
          code: sanitizeLimitedString(data.code, 80),
          message,
          listId
        };

        console.error("Falha ao adicionar contato à lista do Brevo:", {
          status: lastBrevoFailure.status,
          code: lastBrevoFailure.code,
          message: lastBrevoFailure.message,
          listId
        });

        throw buildBrevoError("Falha ao adicionar lead à lista do Brevo.", lastBrevoFailure);
      }

      results.push({
        listId,
        status: response.status,
        alreadyInList
      });
    }

    return {
      ok: true,
      skipped: false,
      listIds,
      results
    };
  }

  async function confirmBrevoSuccess(attemptName, data) {
    const listSync = await addBrevoContactToLists();

    return {
      data,
      attempt: attemptName,
      listSynced: !listSync.skipped,
      listIds: listSync.listIds
    };
  }

  function withListIds(payload) {
    if (listIds.length === 0) {
      return payload;
    }

    return {
      ...payload,
      listIds
    };
  }

  const fullPayload = withListIds({
    email: lead.email,
    attributes: {
      NOME: firstName,
      SOBRENOME: lastName,
      SMS: brevoPhone,
      TELEFONE: brevoPhone,
      ORIGEM: lead.origem,
      CAMPANHA: lead.campanha,
      PAGINA_CAPTURA: lead.pagina,
      PAGINA: lead.pagina,
      UTM_SOURCE: lead.utm_source,
      UTM_MEDIUM: lead.utm_medium,
      UTM_CAMPAIGN: lead.utm_campaign,
      UTM_CONTENT: lead.utm_content,
      UTM_TERM: lead.utm_term,
      STATUS_LEAD: "ebook_enviado",
      STATUS_FUNIL: lead.status_funil || "baixou_ebook",
      CONSENTIMENTO: lead.consentimento ? true : false,
      BAIXOU_EBOOK: true,
      PRODUTO_INTERESSE: "Ebook gratuito"
    },
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: true
  });

  const minimalPayload = withListIds({
    email: lead.email,
    attributes: {
      NOME: firstName,
      SOBRENOME: lastName
    },
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: true
  });

  const minimalWithoutListPayload = {
    ...minimalPayload
  };
  delete minimalWithoutListPayload.listIds;

  const emailOnlyPayload = withListIds({
    email: lead.email,
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: true
  });

  const emailOnlyWithoutListPayload = {
    ...emailOnlyPayload
  };
  delete emailOnlyWithoutListPayload.listIds;

  const bareEmailPayload = withListIds({
    email: lead.email,
    updateEnabled: true
  });

  const bareEmailWithoutListPayload = {
    ...bareEmailPayload
  };
  delete bareEmailWithoutListPayload.listIds;

  const minimalAttempt = await sendBrevoContact(minimalPayload, "minimal_payload");
  if (minimalAttempt.ok) {
    const fullAttempt = await sendBrevoContact(fullPayload, "full_payload_after_minimal");

    if (!fullAttempt.ok) {
      console.warn(
        "Contato registrado no Brevo, mas atributos completos não foram confirmados. Confira atributos customizados."
      );
    }

    return confirmBrevoSuccess("minimal_payload", minimalAttempt.data);
  }

  const fullAttempt = await sendBrevoContact(fullPayload, "full_payload");
  if (fullAttempt.ok) {
    return confirmBrevoSuccess("full_payload", fullAttempt.data);
  }

  if (listIds.length > 0) {
    const minimalWithoutListAttempt = await sendBrevoContact(
      minimalWithoutListPayload,
      "minimal_payload_without_list"
    );

    if (minimalWithoutListAttempt.ok) {
      console.warn(
        "Contato registrado no Brevo sem lista. Confira se BREVO_LIST_ID_EBOOK corresponde a uma lista existente."
      );

      return confirmBrevoSuccess("minimal_payload_without_list", minimalWithoutListAttempt.data);
    }
  }

  const emailOnlyAttempt = await sendBrevoContact(emailOnlyPayload, "email_only_payload");
  if (emailOnlyAttempt.ok) {
    console.warn(
      "Contato registrado no Brevo apenas com e-mail. Confira atributos customizados e lista do ebook."
    );

    return confirmBrevoSuccess("email_only_payload", emailOnlyAttempt.data);
  }

  if (listIds.length > 0) {
    const emailOnlyWithoutListAttempt = await sendBrevoContact(
      emailOnlyWithoutListPayload,
      "email_only_payload_without_list"
    );

    if (emailOnlyWithoutListAttempt.ok) {
      console.warn(
        "Contato registrado no Brevo apenas com e-mail e sem lista. Confira BREVO_LIST_ID_EBOOK."
      );

      return confirmBrevoSuccess("email_only_payload_without_list", emailOnlyWithoutListAttempt.data);
    }
  }

  const bareEmailAttempt = await sendBrevoContact(bareEmailPayload, "bare_email_payload");
  if (bareEmailAttempt.ok) {
    console.warn(
      "Contato registrado no Brevo com payload essencial. Confira atributos, lista e flags do contato."
    );

    return confirmBrevoSuccess("bare_email_payload", bareEmailAttempt.data);
  }

  if (listIds.length > 0) {
    const bareEmailWithoutListAttempt = await sendBrevoContact(
      bareEmailWithoutListPayload,
      "bare_email_payload_without_list"
    );

    if (bareEmailWithoutListAttempt.ok) {
      console.warn(
        "Contato registrado no Brevo com payload essencial e sem lista. Confira BREVO_LIST_ID_EBOOK."
      );

      return confirmBrevoSuccess("bare_email_payload_without_list", bareEmailWithoutListAttempt.data);
    }
  }

  throw buildBrevoError("Falha ao registrar lead no Brevo.");
}

async function sendEbookEmail(lead) {
  const ebookUrl = normalizePublicUrl(getEnvValue("EBOOK_URL"));
  const quizUrl = withDefaultParams(
    normalizePublicUrl(
      getEnvValue("QUIZ_EBOOK_URL"),
      "https://padraointerrompido.com.br/quiz-mpi/"
    ),
    {
      utm_source: "resend",
      utm_medium: "email",
      utm_campaign: "entrega_ebook",
      utm_content: "cta_quiz",
      origem: "ebook"
    }
  );

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Oi, ${lead.nome}!</h2>

      <p>Seu ebook gratuito está aqui:</p>

      <p>
        <a href="${ebookUrl}" target="_blank" rel="noopener noreferrer">
          Clique aqui para baixar o ebook
        </a>
      </p>

      <p>
        Leia com calma. A ideia não é só consumir mais um conteúdo, mas perceber
        onde o seu padrão começa a se repetir sem você notar.
      </p>

      <p>
        E antes de tentar aplicar tudo de uma vez, existe um próximo passo que pode
        te ajudar bastante:
      </p>

      <p>
        o <strong>Quiz de Mapeamento</strong>.
      </p>

      <p>
        Ele foi criado para revelar o seu ponto de partida e transformar o conteúdo
        do ebook em um caminho mais claro, pessoal e aplicável.
      </p>

      <p>
        <a href="${quizUrl}" target="_blank" rel="noopener noreferrer">
          Descobrir meu ponto de partida
        </a>
      </p>

      <p>
        Com carinho,<br>
        Equipe Padrão Interrompido
      </p>
    </div>
  `;

  const text = `Oi, ${lead.nome}!

Seu ebook gratuito está aqui:
${ebookUrl}

Leia com calma. A ideia não é só consumir mais um conteúdo, mas perceber onde o seu padrão começa a se repetir sem você notar.

E antes de tentar aplicar tudo de uma vez, existe um próximo passo que pode te ajudar bastante:

o Quiz de Mapeamento.

Ele foi criado para revelar o seu ponto de partida e transformar o conteúdo do ebook em um caminho mais claro, pessoal e aplicável.

Descobrir meu ponto de partida:
${quizUrl}

Com carinho,
Equipe Padrão Interrompido`;

  const payload = {
    from: getEnvValue("RESEND_FROM"),
    to: [lead.email],
    subject: "Aqui está o seu ebook gratuito",
    html,
    text,
    tags: [
      {
        name: "funil",
        value: "ebook"
      },
      {
        name: "tipo",
        value: "captura"
      }
    ]
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEnvValue("RESEND_API_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Falha ao enviar e-mail pelo Resend:", {
      status: response.status,
      name: data.name,
      message: data.message
    });

    throw new Error("Falha ao enviar ebook pelo Resend.");
  }

  return data;
}

exports.handler = async function (event) {
  let currentStep = "method_check";

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      success: false,
      message: "Método não permitido."
    });
  }

  currentStep = "content_type_check";
  const contentType = getHeader(event.headers, "content-type");

  if (!contentType.includes("application/json")) {
    return jsonResponse(400, {
      success: false,
      message: "Requisição inválida."
    });
  }

  currentStep = "body_size_check";
  if (isBodyTooLarge(event.body)) {
    return jsonResponse(413, {
      success: false,
      message: "Requisição muito grande."
    });
  }

  currentStep = "json_parse";
  const parsedBody = parseJsonBody(event.body);

  if (!parsedBody.ok) {
    return jsonResponse(400, {
      success: false,
      message: "Requisição inválida."
    });
  }

  try {
    currentStep = "validate_env";
    validateEnv();

    currentStep = "sanitize_payload";
    const body = parsedBody.data;

    currentStep = "anti_bot_check";
    if (isSuspiciousBotSubmission(body)) {
      console.warn("Submissão suspeita bloqueada por honeypot ou tempo mínimo.");
      return genericAcceptedResponse();
    }

    if (
      isRequiredFieldTooLong(body.nome, FIELD_LIMITS.nome) ||
      isRequiredFieldTooLong(body.email, FIELD_LIMITS.email) ||
      getPhoneDigits(body.whatsapp).length > FIELD_LIMITS.whatsapp
    ) {
      return jsonResponse(400, {
        success: false,
        message: "Preencha nome, e-mail, WhatsApp e aceite o consentimento."
      });
    }

    const nome = sanitizeLimitedString(body.nome, FIELD_LIMITS.nome);
    const email = normalizeEmail(body.email);
    const whatsapp = normalizePhone(body.whatsapp);
    const consentimento = body.consentimento;
    const origem = sanitizeLimitedString(body.origem || "ebook", FIELD_LIMITS.origem);
    const campanha = sanitizeLimitedString(body.campanha || "ebook_gratuito", FIELD_LIMITS.campanha);
    const pagina = sanitizeLimitedString(body.pagina || "/ebook", FIELD_LIMITS.pagina);
    const utm_source = sanitizeLimitedString(body.utm_source, FIELD_LIMITS.utm_source);
    const utm_medium = sanitizeLimitedString(body.utm_medium, FIELD_LIMITS.utm_medium);
    const utm_campaign = sanitizeLimitedString(body.utm_campaign, FIELD_LIMITS.utm_campaign);
    const utm_content = sanitizeLimitedString(body.utm_content, FIELD_LIMITS.utm_content);
    const utm_term = sanitizeLimitedString(body.utm_term, FIELD_LIMITS.utm_term);
    const status_funil = sanitizeLimitedString(
      body.status_funil || "baixou_ebook",
      FIELD_LIMITS.status_funil
    );

    if (!nome || !email || !whatsapp || !consentimento) {
      return jsonResponse(400, {
        success: false,
        message: "Preencha nome, e-mail, WhatsApp e aceite o consentimento."
      });
    }

    if (!isValidEmail(email)) {
      return jsonResponse(400, {
        success: false,
        message: "Informe um e-mail válido."
      });
    }

    if (whatsapp.length < 10) {
      return jsonResponse(400, {
        success: false,
        message: "Informe um WhatsApp válido com DDD."
      });
    }

    const lead = {
      nome,
      email,
      whatsapp,
      consentimento,
      origem,
      campanha,
      pagina,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      status_funil
    };

    let brevoSaved = false;
    let brevoErrorMessage = "";
    let brevoErrorDetail = null;
    let brevoSyncInfo = null;

    currentStep = "brevo_upsert";
    try {
      brevoSyncInfo = await upsertContactBrevo(lead);
      brevoSaved = true;
    } catch (brevoError) {
      brevoErrorMessage = brevoError.message;
      brevoErrorDetail = brevoError.brevo || null;
      console.error("Falha no Brevo sem bloquear envio do ebook:", {
        step: currentStep,
        message: brevoError.message,
        brevo: brevoErrorDetail
      });
    }

    currentStep = "resend_email";
    await sendEbookEmail(lead);

    currentStep = "success_response";
    if (!brevoSaved) {
      console.warn("Ebook enviado, mas lead não foi confirmado no Brevo:", {
        message: brevoErrorMessage
      });
    }

    return jsonResponse(200, {
      success: true,
      message: brevoSaved
        ? "Lead salvo e ebook enviado."
        : "Ebook enviado. Cadastro pendente de sincronização.",
      redirect: "/ebook/obrigado.html",
      brevoSynced: brevoSaved,
      brevoStatus: brevoSaved ? "synced" : "failed",
      brevoSync: brevoSaved
        ? {
            attempt: brevoSyncInfo ? brevoSyncInfo.attempt : "unknown",
            listSynced: brevoSyncInfo ? brevoSyncInfo.listSynced : false,
            listIds: brevoSyncInfo ? brevoSyncInfo.listIds : []
          }
        : undefined,
      brevoError: brevoSaved ? undefined : brevoErrorDetail
    });
  } catch (error) {
    console.error("Erro na captura do ebook:", {
      step: currentStep,
      message: error.message
    });

    return jsonResponse(500, {
      success: false,
      message: "Erro interno ao processar cadastro.",
      code: currentStep
    });
  }
};
