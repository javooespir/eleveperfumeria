// URL base del sitio — la usan metadata, canonical, robots.txt y sitemap.
//
// Se lee de NEXT_PUBLIC_SITE_URL para poder cambiar el dominio desde las
// variables de entorno de Vercel, sin tocar codigo ni volver a desplegar.
const FALLBACK = "https://eleveimportados.com.ar";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK).replace(/\/$/, "");
