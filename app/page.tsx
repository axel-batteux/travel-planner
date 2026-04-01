export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Prêts pour la prochaine aventure ?</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compte à rebours */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col justify-center items-center text-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Prochain départ dans</h2>
          <p className="text-5xl font-extrabold text-primary">42 Jours</p>
          <p className="mt-4 text-sm">Départ pour le <span className="font-semibold">Japon</span></p>
        </div>

        {/* Budget */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Budget de voyage</h2>
          <div className="space-y-2">
            <p className="text-3xl font-bold">2 450 €</p>
            <p className="text-sm text-green-600 font-medium">Encore dans le vert !</p>
          </div>
          <div className="mt-6">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: "45%" }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
              <span>0 €</span>
              <span>Total : 5000 €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
