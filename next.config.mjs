/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // better-sqlite3 is a native module; keep it external so Next doesn't try to
  // bundle it for the server runtime.
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    serverActions: {
      // Gallery upload sends multiple photo files through a Server Action.
      // Default is 1MB, which rejects real photos with HTTP 413.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
