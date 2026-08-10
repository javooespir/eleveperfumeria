import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder de imagenes para el boceto — remover cuando se usen fotos reales en /public/images.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
