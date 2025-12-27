import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase' 

export async function POST(request) {
  try {
    // 1. Recebe os dados enviados pelo script .BAT
    const body = await request.json()
    const { loja_id, status, mensagem } = body

    // 2. Validação básica (segurança)
    if (!loja_id || !status) {
      return NextResponse.json({ error: 'Faltam dados (loja_id ou status)' }, { status: 400 })
    }

    // 3. Atualiza ou Cria a loja no banco de dados
    const { error } = await supabase
      .from('lojas')
      .upsert({ 
        id: loja_id, 
        status: status, 
        mensagem: mensagem,
        ultima_sincronizacao: new Date().toISOString() 
      })

    if (error) {
      console.error('Erro no Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 4. Responde "OK" para o script
    return NextResponse.json({ success: true, message: 'Atualizado com sucesso' })

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}