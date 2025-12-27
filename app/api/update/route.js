import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    // Agora esperamos 'database_id'
    const body = await request.json()
    const { database_id, status, message } = body

    // Validação
    if (!database_id || !status) {
      return NextResponse.json({ error: 'Faltam dados (database_id ou status)' }, { status: 400 })
    }

    // Salva na tabela 'databases'
    const { error } = await supabase
      .from('databases') 
      .upsert({ 
        id: database_id, 
        status: status, 
        message: message,
        last_update: new Date().toISOString() 
      })

    if (error) {
      console.error('Erro Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Database atualizado!' })

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}