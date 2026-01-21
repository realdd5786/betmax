import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://futmax.vercel.app/", changeFrequency: "weekly", priority: 1 },
    { url: "https://futmax.vercel.app/auth/login", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://futmax.vercel.app/auth/register", changeFrequency: "monthly", priority: 0.6 }
  ];
}
