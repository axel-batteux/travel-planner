import { login, loginMock, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL
  const { message } = await searchParams

  return (
    <div className="flex-1 flex w-full h-screen items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50" />

      <div className="w-full max-w-sm">
        <div className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-primary/20 shadow-inner">
               ✈️
             </div>
             <h1 className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">TripVault</h1>
             <p className="text-sm text-muted-foreground mt-2 font-medium">Votre compagnon privé.</p>
          </div>
          
          <form className="flex-1 flex flex-col w-full gap-5">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1" htmlFor="email">Email</label>
              <input
                className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 flex items-center text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 shadow-inner"
                name="email"
                placeholder="vous@exemple.com"
                required
                defaultValue="mock@user.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1" htmlFor="password">Mot de passe</label>
              <input
                className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 flex items-center text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 shadow-inner"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                defaultValue="azerty"
              />
            </div>

            {message && (
              <p className="p-4 bg-muted/50 border border-border backdrop-blur-md text-foreground text-xs font-medium rounded-xl text-center shadow-sm">
                {message}
              </p>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button formAction={isMock ? loginMock : login} className="w-full bg-primary text-primary-foreground font-bold rounded-2xl py-4 transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20 active:scale-95">
                Se connecter
              </button>
              <button formAction={isMock ? loginMock : signup} className="w-full bg-transparent border border-border text-foreground font-bold rounded-2xl py-4 transition-all hover:bg-muted active:scale-95">
                Créer un compte
              </button>
            </div>
            
            {isMock && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ⚙️ Mode Mock activé.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
