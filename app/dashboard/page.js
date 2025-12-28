'use client'

import { supabase } from '@/lib/supabase'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  LogOut,
  Search,
  XCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

// Shadcn Components
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Dashboard() {
  const [databases, setDatabases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const router = useRouter()

  useEffect(() => {
    const buscarDados = async () => {
      const { data, error } = await supabase
        .from('databases')
        .select('*')
        .order('last_update', { ascending: false })

      if (error) {
        console.error("Erro ao buscar databases:", error)
        setLoading(false)
        return
      }

      setDatabases(Array.isArray(data) ? data : [])
      setLoading(false)
    }

    buscarDados()
    const intervalo = setInterval(buscarDados, 30000)
    return () => clearInterval(intervalo)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getStatusBadge = (db) => {
    const status = String(db?.status ?? '').toLowerCase()

    // Se não tem last_update, já considera como "atrasado"
    if (!db?.last_update) {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 gap-1"
        >
          <AlertTriangle size={12} /> Sem update
        </Badge>
      )
    }

    const agora = new Date()
    const dataBackup = new Date(db.last_update)
    const diffHoras = Math.abs(agora - dataBackup) / 36e5

    if (status === 'erro') {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle size={12} /> Falha Crítica
        </Badge>
      )
    }

    if (diffHoras > 26) {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 gap-1"
        >
          <AlertTriangle size={12} /> Atrasado
        </Badge>
      )
    }

    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 border gap-1">
        <CheckCircle2 size={12} /> Operacional
      </Badge>
    )
  }

  const dbsFiltrados = useMemo(() => {
    const f = String(filtro ?? "").toLowerCase().trim()
    if (!f) return databases

    return databases.filter((db) => {
      const idStr = String(db?.id ?? "").toLowerCase()
      const nameStr = String(db?.client_name ?? "").toLowerCase()
      return idStr.includes(f) || nameStr.includes(f)
    })
  }, [databases, filtro])

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8 bg-background">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Painel de Monitoramento</h1>
            <p className="text-muted-foreground">VR Software</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente ou ID..."
              className="pl-8 bg-card border-border"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
            <Clock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Grid de Cards */}
      {loading ? (
        <div className="text-center py-20 animate-pulse text-muted-foreground">Carregando dados...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dbsFiltrados.length === 0 ? (
            <p className="col-span-full text-center py-10 text-muted-foreground">Nenhum cliente encontrado.</p>
          ) : (
            dbsFiltrados.map((db) => {
              const clientName = db?.client_name || `Cliente #${db?.id ?? "?"}`
              const msg = db?.message ?? ""

              const last = db?.last_update ? new Date(db.last_update) : null
              const lastText = last
                ? `${last.toLocaleDateString('pt-BR')} às ${last.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                : "Sem atualização"

              return (
                <Card key={db.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-all hover:border-primary/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle
                      className="text-sm font-medium truncate pr-4 text-foreground"
                      title={clientName}
                    >
                      {clientName}
                    </CardTitle>
                    {getStatusBadge(db)}
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <div className="text-2xl font-bold text-primary/90 truncate" title={clientName}>
                        {clientName}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono ml-3">
                        ID: {db?.id ?? "-"}
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-2 text-xs font-mono text-muted-foreground truncate mb-4 border border-border">
                      {msg || "Sem mensagem"}
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Último backup: {lastText}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
