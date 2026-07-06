/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Article « cave humide » consolidé : l'ancien guide court a été
        // fusionné dans le guide complet « traiter-cave-humide ».
        source: "/maison/comment-reduire-humidite-cave",
        destination: "/maison/traiter-cave-humide",
        permanent: true,
      },
      // Cohérence des rubriques : trois articles ont été reclassés pour
      // correspondre à la rubrique de leur silo (isolation → Travaux,
      // maison saine → Maison). Les anciennes URL redirigent en 301.
      {
        source: "/energie/isoler-combles-perdus",
        destination: "/travaux/isoler-combles-perdus",
        permanent: true,
      },
      {
        source: "/energie/isolants-biosources",
        destination: "/travaux/isolants-biosources",
        permanent: true,
      },
      {
        source: "/energie/taux-humidite-ideal-maison",
        destination: "/maison/taux-humidite-ideal-maison",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
