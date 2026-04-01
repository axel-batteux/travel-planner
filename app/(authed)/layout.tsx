import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Guard: if mock mode or real user, allow. Else redirect to login.
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect("/login")
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col md:ml-64 pb-16 md:pb-0 w-full">
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
