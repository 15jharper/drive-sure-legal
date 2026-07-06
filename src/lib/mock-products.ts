import type { Product } from "@/lib/types";

const mockProduct: Product = {
  id: "444499311",
  handle: "6a473aa4e2f7d6",
  title: "Purpose",
  subtitle: "Pastel Cap",
  description:
    "Move with intention. A soft pastel-washed cap for the quietly purposeful.",
  featuredImage: {
    url: "https://files.cdn.printful.com/files/388/388c363ab31b966983fd417b07f72e82_preview.png",
    altText: "Pastel baseball hat — Pastel Mint",
  },
  images: [
    {
      url: "https://files.cdn.printful.com/files/388/388c363ab31b966983fd417b07f72e82_preview.png",
      altText: "Pastel baseball hat — Pastel Mint",
    },
    {
      url: "https://files.cdn.printful.com/files/f71/f71deb249eccbf2dd60f16b65845e427_preview.png",
      altText: "Pastel baseball hat — Beige",
    },
  ],
  price: { amount: "35.00", currencyCode: "USD" },
  compareAtPrice: null,
  availableForSale: true,
  options: [
    {
      id: "opt-style",
      name: "Style",
      values: [
        "Pastel baseball hat / Beige",
        "Pastel baseball hat / Pastel Blue",
        "Pastel baseball hat / Pastel Pink",
      ],
    },
  ],
  variants: [
    {
      id: "5379516433",
      title: "Pastel baseball hat / Beige",
      availableForSale: true,
      selectedOptions: [{ name: "Style", value: "Pastel baseball hat / Beige" }],
      price: { amount: "35.00", currencyCode: "USD" },
      image:
        "https://files.cdn.printful.com/files/f71/f71deb249eccbf2dd60f16b65845e427_preview.png",
    },
    {
      id: "5379516434",
      title: "Pastel baseball hat / Pastel Blue",
      availableForSale: true,
      selectedOptions: [{ name: "Style", value: "Pastel baseball hat / Pastel Blue" }],
      price: { amount: "35.00", currencyCode: "USD" },
      image:
        "https://files.cdn.printful.com/files/3e3/3e33bf304dd0dec9dfc58930212daa80_preview.png",
    },
    {
      id: "5379516435",
      title: "Pastel baseball hat / Pastel Pink",
      availableForSale: true,
      selectedOptions: [{ name: "Style", value: "Pastel baseball hat / Pastel Pink" }],
      price: { amount: "35.00", currencyCode: "USD" },
      image:
        "https://files.cdn.printful.com/files/652/652337959ec930948acfeb8e2d63fbf1_preview.png",
    },
  ],
  category: "women",
};

export function getMockProducts(): Product[] {
  return [mockProduct];
}

export function getMockFeaturedProduct(): Product {
  return mockProduct;
}

export function getMockProductByHandle(handle: string): Product | null {
  return getMockProducts().find((product) => product.handle === handle) ?? null;
}
