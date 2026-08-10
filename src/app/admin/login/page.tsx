"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, { error: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1 mb-2">
              <Logo className="h-9 w-auto" />
              <p className="text-xs text-muted-foreground tracking-wide uppercase mt-1">Admin</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user">Usuario</Label>
              <Input id="user" name="user" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {state.error && <p className="text-sm text-destructive">{state.error}</p>}

            <Button type="submit" className="w-full" disabled={pending}>
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
