import type { MetadataRoute } from "next";

const internalRoutes = [
  "/admin",
  "/mvp",
  "/demo",
  "/preview",
  "/ai-map",
  "/synthetic-smoke",
  "/pilot",
  "/pilot-auth-check",
  "/pilot-auth-server-check",
  "/pwa-check",
  "/pwa-reset",
  "/requester-portal",
  "/facility-portal",
  "/partner-portal",
  "/internal-access"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: internalRoutes
      }
    ]
  };
}
