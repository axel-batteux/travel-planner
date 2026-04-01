import { login, loginMock } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL
  const { message } = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-12 mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center tracking-tight">TravelPlanner</h1>
        
        <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground" action={isMock ? loginMock : login}>
          <label className="text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-xl px-4 py-2 border border-border bg-inherit mb-2"
            name="email"
            placeholder="vous@exemple.com"
            required
            defaultValue="mock@user.com"
          />
          <label className="text-sm font-semibold" htmlFor="password">
            Mot de passe
          </label>
          <input
            className="rounded-xl px-4 py-2 border border-border bg-inherit mb-2"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            defaultValue="azerty"
          />
          {message && (
             <p className="mt-4 p-3 bg-red-100 text-red-700 text-xs font-medium rounded-lg text-center">
              {message}
            </p>
          )}
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl px-4 py-3 border-none mt-4 transition-colors">
            Se connecter
          </button>
          
          {isMock && (
             <p className="text-xs text-muted-foreground mt-6 text-center">
               ⚙️ Mode <b>MOCK</b> activé (aucune BDD connectée).<br/>
               Cliquez juste sur Se connecter.
             </p>
          )}
        </form>
      </div>
    </div>
  )
}
