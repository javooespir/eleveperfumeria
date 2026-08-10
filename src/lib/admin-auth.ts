import { cookies } from "next/headers";

// TODO: reemplazar por auth real (hash de password, sesiones en DB) antes de produccion.
// Prototipo: credenciales fijas via variables de entorno + cookie de sesion simple.
const COOKIE_NAME = "eleve_admin";

export function verifyAdminCredentials(user: string, password: string) {
  return user === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}
