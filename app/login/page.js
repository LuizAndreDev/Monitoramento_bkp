'use client'
import { supabase } from '@/lib/supabase'
import { AlertCircle, Database, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Componentes UI manuais
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erroLogin, setErroLogin] = useState('') 
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErroLogin('') 

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (!error) {
      router.push('/dashboard')
    } else {
      setErroLogin('Credenciais inválidas. Verifique seu email e senha.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Fundo com gradiente sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />

      <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Database className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">VR Monitor</CardTitle>
          <CardDescription>
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Mensagem de Erro Elegante */}
            {erroLogin && (
              <div className="p-3 rounded-md bg-destructive/15 border border-destructive/20 flex items-center gap-2 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} />
                <span>{erroLogin}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                // placeholder removido
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <Input 
                id="password" 
                type="password" 
                // placeholder removido
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>
            <Button className="w-full font-bold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Acessar Painel'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6">
            <p className="text-xs text-muted-foreground">© 2025 VR Software &bull; Sistema Seguro</p>
        </CardFooter>
      </Card>
    </div>
  )
}