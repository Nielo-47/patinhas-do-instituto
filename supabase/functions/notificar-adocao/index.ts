import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdocaoRequest {
  id: string;
  nome_gato: string;
  nome_candidato: string;
  contato_candidato: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome_gato, nome_candidato, contato_candidato }: AdocaoRequest =
      await req.json();

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Adoção de Gatos <onboarding@resend.dev>",
        to: ["patinhasdoinstituto@gmail.com"],
        subject: "Novo Pedido de Adoção Recebido",
        html: `
          <h2>Novo Pedido de Adoção</h2>
          <p><strong>Gato:</strong> ${nome_gato}</p>
          <p><strong>Nome do Candidato:</strong> ${nome_candidato}</p>
          <p><strong>Contato:</strong> ${contato_candidato}</p>
          <p>Acesse o sistema para visualizar mais detalhes e gerenciar este pedido.</p>
        `,
      }),
    });

    const emailData = await emailResponse.json();
    console.log("Email enviado com sucesso:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
