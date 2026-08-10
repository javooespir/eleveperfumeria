"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials, setAdminSession } from "@/lib/admin-auth";

export type LoginState = { error: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(user, password)) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await setAdminSession();
  redirect("/admin");
}
