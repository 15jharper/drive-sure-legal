import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/printful";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const lastModified = new Date();

  return [
    { url: siteConfig.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/shop`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/shop/men`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/shop/women`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...products.map((product) => ({
      url: `${siteConfig.url}/product/${product.handle}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
