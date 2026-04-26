/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lint + type errors are checked in CI separately; skip during Netlify build
  // to avoid ESLint flat-config / env differences causing exit-code-2 failures.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "vumbnail.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "thechurchco-production.s3.amazonaws.com" },
      { protocol: "https", hostname: "futures.college" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
