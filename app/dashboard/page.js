'use client'
import {
  AlertTriangle, CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Server,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'; // Verifique o caminho

export default function Dashboard() {
  const [databases, setDatabases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')

  const carregarDados = async () => {
    setLoading(true)
    // Busca os ultimos status (Considerando que sua tabela guarda histórico)
    // Aqui usamos um truque: Ordenar e pegar o mais recente de cada ID no frontend
    // Ou idealmente ter uma tabela de "Current Status" no banco.
    const { data, error } = await supabase
      .from('databases')
      .select('*')
      .order('last_update', { ascending: false })

    if (data) {
      // Lógica para remover duplicados e manter só o mais recente de cada cliente
      const unicos = []
      const map = new Map()
      for (const item of data) {
        if (!map.has(item.id)) {
          map.set(item.id, true)
          unicos.push(item)
        }
      }
      setDatabases(unicos)
    }
    setLoading(false)
  }

  useEffect(() => {
    carregarDados()
    const intervalo = setInterval(carregarDados, 60000) // Atualiza a cada 1 min
    return () => clearInterval(intervalo)
  }, [])

  // Função para decidir a cor do status
  const getStatusColor = (db) => {
    const agora = new Date()
    const dataBackup = new Date(db.last_update)
    const diffHoras = Math.abs(agora - dataBackup) / 36e5

    // Se o status veio da API como erro
    if (db.status === 'erro') return 'bg-red-500/10 border-red-500 text-red-500'
    
    // Se faz mais de 26 horas que não tem backup (Atrasado)
    if (diffHoras > 26) return 'bg-yellow-500/10 border-yellow-500 text-yellow-500'

    // Tudo ok
    return 'bg-green-500/10 border-green-500 text-green-500'
  }

  const getStatusIcon = (db) => {
    const colorClass = getStatusColor(db)
    if (colorClass.includes('red')) return <XCircle />
    if (colorClass.includes('yellow')) return <AlertTriangle />
    return <CheckCircle />
  }

  // Filtragem
  const dbsFiltrados = databases.filter(db => 
    db.id.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Server className="text-blue-500" size={32} /> 
              Painel de Monitoramento VR
            </h1>
            <p className="text-slate-400 mt-1">Gerenciamento de Backups em Tempo Real</p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            </div>
            <button onClick={carregarDados} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Grid de Cards */}
        {loading ? (
          <div className="text-center py-20 animate-pulse">Carregando dados...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dbsFiltrados.map((db) => (
              <div key={db.id} className={`p-6 rounded-xl border ${getStatusColor(db)} transition-all hover:scale-[1.02] shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold truncate text-white" title={db.id}>
                    {db.id}
                  </h2>
                  {getStatusIcon(db)}
                </div>
                
                <div className="space-y-3">
                   <div className="text-xs font-mono bg-slate-900/50 p-2 rounded">
                     {db.message}
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm opacity-80">
                     <Clock size={16} />
                     {new Date(db.last_update).toLocaleString('pt-BR')}
                   </div>
                   
                   {/* Badge de Status Texto */}
                   <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-slate-900/30 uppercase tracking-wider">
                     {db.status === 'erro' ? 'Falha' : 'Sucesso'}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}