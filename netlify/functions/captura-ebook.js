function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(payload)
  };
}

function sanitizeString(value = "") {
  return String(value).trim();
}

function normalizeEmail(value = "") {
  return sanitizeString(value).toLowerCase();
}

function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "");
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
  const value = Number(process.env[key]);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function validateEnv() {
  const required = [
    "RESEND_API_KEY",
    "RESEND_FROM",
    "EBOOK_URL"
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Variáveis de ambiente obrigatórias ausentes:", missing.join(", "));
    throw new Error("Configuração incompleta do servidor.");
  }
}

async function upsertContactBrevo(lead) {
  if (!process.env.BREVO_API_KEY) {
    console.warn("BREVO_API_KEY ausente. Lead não enviado ao Brevo nesta execução.");
    return null;
  }

  const { firstName, lastName } = splitName(lead.nome);
  const brevoPhone = normalizeBrevoPhone(lead.whatsapp);
  const listIds = [
    getOptionalNumberEnv("BREVO_LIST_ID_EBOOK")
  ].filter(Boolean);

  const payload = {
    email: lead.email,
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
      SMS: brevoPhone,
      WHATSAPP: brevoPhone,
      ORIGEM: lead.origem,
      CAMPANHA: lead.campanha,
      PAGINA_CAPTURA: lead.pagina,
      STATUS_LEAD: "ebook_enviado",
      BAIXOU_EBOOK: true,
      PRODUTO_INTERESSE: "Ebook gratuito"
    },
    emailBlacklisted: false,
    smsBlacklisted: false,
    updateEnabled: true
  };

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Falha ao criar/atualizar contato no Brevo:", {
      status: response.status,
      code: data.code,
      message: data.message
    });

    return null;
  }

  return data;
}

async function sendEbookEmail(lead) {
  const quizUrl = process.env.QUIZ_EBOOK_URL;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Oi, ${lead.nome}!</h2>

      <p>Seu ebook gratuito está aqui:</p>

      <p>
        <a href="${process.env.EBOOK_URL}" target="_blank" rel="noopener noreferrer">
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

      ${
        quizUrl
          ? `<p>
              <a href="${quizUrl}" target="_blank" rel="noopener noreferrer">
                Descobrir meu ponto de partida
              </a>
            </p>`
          : ""
      }

      <p>
        Com carinho,<br>
        Equipe Padrão Interrompido
      </p>
    </div>
  `;

  const text = `Oi, ${lead.nome}!

Seu ebook gratuito está aqui:
${process.env.EBOOK_URL}

Leia com calma. A ideia não é só consumir mais um conteúdo, mas perceber onde o seu padrão começa a se repetir sem você notar.

E antes de tentar aplicar tudo de uma vez, existe um próximo passo que pode te ajudar bastante:

o Quiz de Mapeamento.

Ele foi criado para revelar o seu ponto de partida e transformar o conteúdo do ebook em um caminho mais claro, pessoal e aplicável.${
  quizUrl
    ? `

Descobrir meu ponto de partida:
${quizUrl}`
    : ""
}

Com carinho,
Equipe Padrão Interrompido`;

  const payload = {
    from: process.env.RESEND_FROM,
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
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      success: false,
      message: "Método não permitido."
    });
  }

  try {
    validateEnv();

    const body = JSON.parse(event.body || "{}");

    const nome = sanitizeString(body.nome);
    const email = normalizeEmail(body.email);
    const whatsapp = normalizePhone(body.whatsapp);
    const consentimento = body.consentimento;
    const origem = sanitizeString(body.origem || "Página Ebook");
    const campanha = sanitizeString(body.campanha || "ebook_gratuito");
    const pagina = sanitizeString(body.pagina || "/ebook");

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
      origem,
      campanha,
      pagina
    };

    await upsertContactBrevo(lead);
    await sendEbookEmail(lead);

    return jsonResponse(200, {
      success: true,
      message: "Lead salvo e ebook enviado.",
      redirect: "/ebook/obrigado.html"
    });
  } catch (error) {
    console.error("Erro na captura do ebook:", {
      message: error.message
    });

    return jsonResponse(500, {
      success: false,
      message: "Erro interno ao processar cadastro."
    });
  }
};
