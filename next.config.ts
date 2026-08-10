import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder de imagenes para el boceto — remover cuando se usen fotos reales en /public/images.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // El archivo SQLite se abre via ruta dinamica (no import estatico), asi que
  // el tracing de Next no lo detecta solo — hay que incluirlo a mano para que
  // viaje dentro de la función serverless.
  outputFileTracingIncludes: {
    "/*": ["./dev.db"],
  },
};

export default nextConfig;
