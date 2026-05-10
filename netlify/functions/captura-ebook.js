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

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitName(fullName = "") {
  const parts = sanitizeString(fullName).split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "Lead";
  const lastName = parts.join(" ") || firstName;

  return {
    firstName,
    lastName
  };
}

function validateEnv() {
  const required = [
    "RESEND_API_KEY",
    "RESEND_FROM",
    "ZOHO_CLIENT_ID",
    "ZOHO_CLIENT_SECRET",
    "ZOHO_REFRESH_TOKEN",
    "ZOHO_ACCOUNTS_URL",
    "ZOHO_API_DOMAIN",
    "EBOOK_URL"
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Variáveis de ambiente ausentes:", missing.join(", "));
    throw new Error("Configuração incompleta do servidor.");
  }
}

async function getZohoAccessToken() {
  const params = new URLSearchParams();

  params.append("refresh_token", process.env.ZOHO_REFRESH_TOKEN);
  params.append("client_id", process.env.ZOHO_CLIENT_ID);
  params.append("client_secret", process.env.ZOHO_CLIENT_SECRET);
  params.append("grant_type", "refresh_token");

  const response = await fetch(`${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
    method: "POST",
    body: params
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    console.error("Falha ao gerar access token do Zoho:", {
      status: response.status,
      error: data.error,
      error_description: data.error_description
    });

    throw new Error("Falha ao autenticar no Zoho CRM.");
  }

  return data.access_token;
}

async function upsertLeadZoho(lead) {
  const accessToken = await getZohoAccessToken();

  const { firstName, lastName } = splitName(lead.nome);

  const payload = {
    data: [
      {
        First_Name: firstName,
        Last_Name: lastName,
        Email: lead.email,
        Mobile: lead.whatsapp,
        Company: "Lead Ebook",
        Lead_Source: lead.origem || "Página Ebook",
        Description: `Lead capturado na página ${lead.pagina || "/ebook"}. Campanha: ${lead.campanha || "ebook_gratuito"}. Consentimento: sim.`

        // Campos customizados podem ser adicionados aqui futuramente,
        // desde que os API Names estejam confirmados no Zoho CRM.
        //
        // Exemplo:
        // Etapa_do_Funil: "Ebook baixado",
        // Interesse: "Ebook gratuito",
        // Consentimento_LGPD: true,
        // Produto_Ofertado: "Quiz R$17"
      }
    ],
    duplicate_check_fields: ["Email"],
    trigger: ["workflow"]
  };

  const response = await fetch(`${process.env.ZOHO_API_DOMAIN}/crm/v8/Leads/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Falha ao fazer upsert no Zoho CRM:", {
      status: response.status,
      data
    });

    throw new Error("Falha ao salvar lead no Zoho CRM.");
  }

  return data;
}

async function sendEbookEmail(lead) {
  const quizUrl = process.env.QUIZ_EBOOK_URL;

  const quizHtml = quizUrl
    ? `
      <p>
        Depois, se fizer sentido, você também pode fazer o quiz diagnóstico de R$17
        para receber um direcionamento mais personalizado:
      </p>
      <p>
        <a href="${quizUrl}" target="_blank" rel="noopener noreferrer">
          Fazer o quiz diagnóstico por R$17
        </a>
      </p>
    `
    : `
      <p>
        Depois, se fizer sentido, você também pode fazer o quiz diagnóstico de R$17
        para receber um direcionamento mais personalizado.
      </p>
    `;

  const quizText = quizUrl
    ? `\n\nDepois, se fizer sentido, você também pode fazer o quiz diagnóstico de R$17 para receber um direcionamento mais personalizado:\n${quizUrl}`
    : `\n\nDepois, se fizer sentido, você também pode fazer o quiz diagnóstico de R$17 para receber um direcionamento mais personalizado.`;

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
        Leia com calma. A ideia é te ajudar a enxergar com mais clareza
        o que pode estar travando o seu próximo passo.
      </p>

      ${quizHtml}

      <p>
        Com carinho,<br>
        Equipe
      </p>
    </div>
  `;

  const text = `Oi, ${lead.nome}!

Seu ebook gratuito está aqui:
${process.env.EBOOK_URL}

Leia com calma. A ideia é te ajudar a enxergar com mais clareza o que pode estar travando o seu próximo passo.${quizText}

Equipe`;

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
      data
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

    await upsertLeadZoho(lead);
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
