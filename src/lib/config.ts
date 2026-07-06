export const siteConfig = {
  name: "NOBODY KNOWS",
  tagline: "The work happens long before the recognition.",
  description:
    "NOBODY KNOWS — premium headwear for those building something bigger than themselves. The work happens long before the recognition.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wearnobodyknows.com",
  email: "jordanharper412@icloud.com",
  freeShippingThreshold: 75,
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
  },
  countries: [
    { code: "US", label: "United States" },
    { code: "CA", label: "Canada" },
    { code: "GB", label: "United Kingdom" },
    { code: "AU", label: "Australia" },
    { code: "NZ", label: "New Zealand" },
    { code: "IE", label: "Ireland" },
    { code: "DE", label: "Germany" },
    { code: "FR", label: "France" },
    { code: "ES", label: "Spain" },
    { code: "IT", label: "Italy" },
    { code: "NL", label: "Netherlands" },
    { code: "SE", label: "Sweden" },
  ],
};
