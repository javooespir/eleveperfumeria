// URL base del sitio — la usan metadata, canonical, robots.txt y sitemap.
//
// Se lee de NEXT_PUBLIC_SITE_URL para poder cambiar el dominio desde las
// variables de entorno de Vercel, sin tocar codigo ni volver a desplegar.
// Al conectar eleveimportados.com.ar alcanza con setear esa variable.
const FALLBACK = "https://eleve-rho-snowy.vercel.app";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK).replace(/\/$/, "");
