'use client'
import { AlertCircle, CheckCircle, Clock, RefreshCw, Server } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [databases, setDatabases] = useState([])
  const [loading, setLoading] = useState(true)

  // Função para buscar dados
  async function fetchDatabases() {
    setLoading(true)
    // MUDANÇA AQUI: .from('databases')
    const { data, error } = await supabase
      .from('databases')
      .select('*')
      .order('last_update', { ascending: false })

    if (error) console.error('Erro ao buscar:', error)
    else setDatabases(data || [])
    
    setLoading(false)
  }

  useEffect(() => {
    fetchDatabases()
    // Atualiza sozinho a cada 30 segundos
    const interval = setInterval(fetchDatabases, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="text-blue-500" /> Monitoramento de Backups
          </h1>
          <button onClick={fetchDatabases} className="p-2 bg-gray-800 rounded hover:bg-gray-700">
            <RefreshCw size={20} />
          </button>
        </div>

        {loading ? (
          <p>Carregando databases...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {databases.map((db) => (
              <div key={db.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{db.id}</h2>
                  {db.status === 'sucesso' ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <AlertCircle className="text-red-500" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2">{db.message}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                  <Clock size={14} />
                  {new Date(db.last_update).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}