// supabase/functions/censo-mensal/index.ts
// Esta Edge Function deve ser agendada para executar todo dia 1º do mês

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Chamar a função de registro de censo
    const { data, error } = await supabase.rpc('registrar_censo_mensal')

    if (error) {
      throw error
    }

    console.log('Censo mensal registrado com sucesso')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Censo mensal registrado com sucesso',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erro ao registrar censo:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

/* 
INSTRUÇÕES DE DEPLOY:

1. Instalar Supabase CLI:
   npm install -g supabase

2. Login:
   supabase login

3. Link ao seu projeto:
   supabase link --project-ref seu-projeto-id

4. Criar a função:
   - Criar pasta: supabase/functions/censo-mensal/
   - Salvar este arquivo como: supabase/functions/censo-mensal/index.ts

5. Deploy:
   supabase functions deploy censo-mensal

6. Agendar no Dashboard do Supabase:
   - Ir para: Edge Functions > censo-mensal > Settings
   - Adicionar um Cron Job com expressão: 0 0 1 * *
   - Isso executará todo dia 1º às 00:00 UTC

7. Testar manualmente:
   curl -X POST 'https://seu-projeto.supabase.co/functions/v1/censo-mensal' \
     -H "Authorization: Bearer SEU_ANON_KEY"

ALTERNATIVA SIMPLES - GitHub Actions:
Criar .github/workflows/censo-mensal.yml no seu repositório:

name: Censo Mensal Automático
on:
  schedule:
    - cron: '0 0 1 * *'  # Todo dia 1º às 00:00 UTC
  workflow_dispatch:  # Permite executar manualmente

jobs:
  registrar-censo:
    runs-on: ubuntu-latest
    steps:
      - name: Chamar função de censo
        run: |
          curl -X POST 'https://seu-projeto.supabase.co/functions/v1/censo-mensal' \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"

Adicione SUPABASE_ANON_KEY nos secrets do GitHub.
*/