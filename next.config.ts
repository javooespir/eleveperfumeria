import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder de imagenes para el boceto — remover cuando se usen fotos reales en /public/images.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    return [
      {
        // www sirve el mismo contenido que el dominio pelado. Para Google
        // serian dos sitios con las mismas paginas, asi que se manda todo a
        // eleveimportados.com.ar, que es lo que dice el canonical.
        source: "/:path*",
        has: [{ type: "host", value: "www.eleveimportados.com.ar" }],
        destination: "https://eleveimportados.com.ar/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
