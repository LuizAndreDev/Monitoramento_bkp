'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, RefreshCw, Server, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Verifica se está logado ao carregar a página
  useEffect(() => {
    const dadosUsuario = localStorage.getItem('usuario_logado')
    if (!dadosUsuario) {
      router.push('/') // Se não tiver logado, manda de volta pro login
    } else {
      setUsuario(JSON.parse(dadosUsuario))
      buscarLogs()
    }
  }, [])

  // 2. Função que busca os dados no Supabase
  const buscarLogs = async () => {
    setLoading(true)
    
    // Busca os últimos 50 registros ordenados por data
    const { data, error } = await supabase
      .from('logs_backup')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) console.error('Erro ao buscar logs:', error)
    else setLogs(data || [])
    
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado')
    router.push('/')
  }

  // Define a cor do status
  const getStatusColor = (status) => {
    if (status === 'sucesso') return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'erro') return 'bg-red-100 text-red-700 border-red-200'
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- BARRA SUPERIOR (NAVBAR) --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Server className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Monitoramento VR</h1>
            <p className="text-xs text-gray-500">Painel de Controle</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase font-bold tracking-wider">
              {usuario?.perfil}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="max-w-7xl mx-auto p-6">
        
        {/* Cabeçalho da Seção */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Status dos Backups</h2>
          <button 
            onClick={buscarLogs}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* --- LISTA DE CARDS (GRID) --- */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Carregando dados...</div>
        ) : logs.length === 0 ? (
          // ESTADO VAZIO (ZERO DADOS)
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <Server className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum backup recebido ainda</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              O sistema está aguardando o primeiro envio. Execute a <b>BAT de teste</b> no servidor para ver os dados aparecerem aqui.
            </p>
          </div>
        ) : (
          // GRID DE CARDS
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 relative overflow-hidden group">
                
                {/* Indicador lateral colorido */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  log.status === 'sucesso' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>

                <div className="flex justify-between items-start mb-4 pl-3">
                  <h3 className="font-bold text-lg text-gray-800 truncate" title={log.cliente_nome}>
                    {log.cliente_nome}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </div>

                <div className="space-y-3 pl-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="text-sm bg-gray-50 p-2 rounded text-gray-600 font-mono text-xs truncate">
                    {log.arquivo_nome || 'Sem arquivo gerado'}
                  </div>

                  {log.mensagem && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {log.mensagem}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}