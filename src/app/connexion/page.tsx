import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Flash from "@/components/Flash";
import { currentUser } from "@/lib/auth";
import { login } from "@/lib/actions";

export const metadata: Metadata = { title: "Connexion administrateur", robots: { index: false } };

export default async function Connexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const user = await currentUser();
  if (user?.role === "ADMIN") redirect("/admin");
  const { erreur } = await searchParams;
  return (
    <section className="section theme-classic">
      <div className="wrap">
        <Flash error={erreur} />
        <form action={login} className="form">
          <h2>Administration</h2>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label>
          <button className="btn">Se connecter</button>
        </form>
      </div>
    </section>
  );
}
