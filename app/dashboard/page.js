'use client'
import { AlertCircle, CheckCircle, Clock, RefreshCw, Server } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [databases, setDatabases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca na tabela 'databases'
        const { data, error } = await supabase
          .from('databases')
          .select('*')
          .order('last_update', { ascending: false })

        if (error) throw error
        if (data) setDatabases(data)
      } catch (error) {
        console.error('Erro ao buscar:', error.message)
      } finally {
        setLoading(false)
      }
    }

    // Chama imediatamente
    carregarDados()

    // Atualiza a cada 30s
    const intervalo = setInterval(carregarDados, 30000)

    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="text-blue-500" /> Monitoramento
          </h1>
          <button 
            onClick={() => window.location.reload()} 
            className="p-2 bg-gray-800 rounded hover:bg-gray-700"
            title="Recarregar página"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {databases.length === 0 ? (
               // AQUI ESTAVA O ERRO: Corrigido para &apos;
               <p className="text-gray-500 col-span-full text-center">
                 Nenhum dado encontrado na tabela &apos;databases&apos;.
               </p>
            ) : (
               databases.map((db) => (
              <div key={db.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold truncate">{db.id}</h2>
                  {db.status === 'sucesso' ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
                </div>
                <p className="text-sm text-gray-300 mb-4">{db.message}</p>
                <div className="text-xs text-gray-500 flex gap-2">
                  <Clock size={14} /> {new Date(db.last_update).toLocaleString('pt-BR')}
                </div>
              </div>
            )))}
          </div>
        )}
      </div>
    </div>
  )
}