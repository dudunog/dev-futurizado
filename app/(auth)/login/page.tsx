import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Admin",
  description: "Entre no painel administrativo",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Magic Banners</h1>
          <p className="text-muted-foreground mt-2">
            Entre com seu email para acessar o painel
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-lg">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Você receberá um link mágico no seu email para entrar
        </p>
      </div>
    </div>
  );
}
