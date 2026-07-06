import type { CartLine, Money, Product, ProductVariant, Recipient } from "@/lib/types";
import { normalizeMoney } from "@/lib/money";
import {
  getMockFeaturedProduct,
  getMockProductByHandle,
  getMockProducts,
} from "@/lib/mock-products";

const PRINTFUL_BASE = "https://api.printful.com";

type PrintfulListItem = {
  id: number;
  external_id?: string;
  name: string;
  thumbnail_url?: string;
  is_ignored?: boolean;
};

type PrintfulSyncVariant = {
  id: number;
  external_id?: string;
  variant_id?: number;
  name?: string;
  retail_price?: string;
  price?: string;
  currency?: string;
  synced?: boolean;
  product?: { variant_id?: number; name?: string; image?: string };
  files?: { preview_url?: string; thumbnail_url?: string }[];
};

type PrintfulSyncProduct = {
  sync_product: {
    id: number;
    external_id?: string;
    name: string;
    thumbnail_url?: string;
  };
  sync_variants: PrintfulSyncVariant[];
};

function getToken() {
  return process.env.PRINTFUL_API_KEY?.trim() ?? "";
}

async function printfulFetch<T>(path: string): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("PRINTFUL_API_KEY is not configured.");
  }

  const response = await fetch(`${PRINTFUL_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  const payload = await response.json();
  if (!response.ok || payload.code !== 200) {
    throw new Error(payload.error?.message ?? "Printful request failed.");
  }

  return payload.result as T;
}

function handleFromExternalId(externalId?: string, id?: number) {
  if (externalId?.trim()) return externalId.trim();
  return String(id ?? "");
}

function inferCategory(name: string): "men" | "women" {
  const lower = name.toLowerCase();
  if (
    lower.includes("women") ||
    lower.includes("pastel") ||
    lower.includes("baby")
  ) {
    return "women";
  }
  return "men";
}

function variantImage(variant: PrintfulSyncVariant, fallback: string) {
  return (
    variant.files?.[0]?.preview_url ??
    variant.files?.[0]?.thumbnail_url ??
    variant.product?.image ??
    fallback
  );
}

function mapVariant(
  variant: PrintfulSyncVariant,
  optionName: string,
  productRetail: Money,
  fallbackImage: string,
): ProductVariant {
  const retail = normalizeMoney(
    {
      amount: variant.retail_price ?? variant.price,
      currencyCode: variant.currency ?? productRetail.currencyCode,
    },
    productRetail,
  );

  return {
    id: String(variant.id),
    title: variant.name ?? variant.product?.name ?? "Default",
    availableForSale: variant.synced !== false,
    selectedOptions: [
      {
        name: optionName,
        value: variant.name ?? variant.product?.name ?? "Default",
      },
    ],
    price: retail,
    image: variantImage(variant, fallbackImage),
  };
}

function mapProduct(detail: PrintfulSyncProduct): Product | null {
  const sync = detail.sync_product;
  const variants = detail.sync_variants ?? [];
  if (!variants.length) return null;

  const optionName = "Style";
  const fallbackImage =
    sync.thumbnail_url ??
    variantImage(variants[0], "") ??
    "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1600&q=80";

  const mappedVariants = variants.map((variant) => {
    const retailPrices = variants
      .map((v) => normalizeMoney(v.retail_price ?? v.price))
      .filter((m) => Number(m.amount) > 0);
    const productRetail =
      retailPrices.sort((a, b) => Number(b.amount) - Number(a.amount))[0] ??
      normalizeMoney(variants[0].retail_price ?? variants[0].price);

    return mapVariant(variant, optionName, productRetail, fallbackImage);
  });

  const price =
    mappedVariants
      .map((variant) => variant.price)
      .sort((a, b) => Number(b.amount) - Number(a.amount))[0] ??
    mappedVariants[0].price;

  const images = Array.from(
    new Map(
      mappedVariants
        .map((variant) => variant.image)
        .filter(Boolean)
        .map((url) => [
          url as string,
          { url: url as string, altText: sync.name },
        ]),
    ).values(),
  );

  const subtitle = sync.name.includes("—")
    ? sync.name.split("—").slice(-1)[0]?.trim() ?? "Headwear"
    : "Headwear";

  return {
    id: String(sync.id),
    handle: handleFromExternalId(sync.external_id, sync.id),
    title: sync.name.split("—")[0]?.trim() || sync.name,
    subtitle,
    description:
      "Move with intention. Premium made-to-order headwear for the quietly purposeful.",
    featuredImage: {
      url: images[0]?.url ?? fallbackImage,
      altText: sync.name,
    },
    images: images.length
      ? images
      : [{ url: fallbackImage, altText: sync.name }],
    price,
    compareAtPrice: null,
    availableForSale: mappedVariants.some((variant) => variant.availableForSale),
    options: [
      {
        id: "opt-style",
        name: optionName,
        values: mappedVariants.map((variant) => variant.title),
      },
    ],
    variants: mappedVariants,
    category: inferCategory(sync.name),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  if (!hasPrintfulCredentials()) {
    return getMockProducts();
  }

  const list = await printfulFetch<PrintfulListItem[]>("/store/products");
  const active = list.filter((item) => !item.is_ignored);

  const products = await Promise.all(
    active.map(async (item) => {
      const detail = await printfulFetch<PrintfulSyncProduct>(
        `/store/products/${item.id}`,
      );
      return mapProduct(detail);
    }),
  );

  return products.filter(Boolean) as Product[];
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!hasPrintfulCredentials()) {
    return getMockProductByHandle(handle);
  }

  const products = await getAllProducts();
  return products.find((product) => product.handle === handle) ?? null;
}

export async function getFeaturedProduct(): Promise<Product | null> {
  if (!hasPrintfulCredentials()) {
    return getMockFeaturedProduct();
  }

  const products = await getAllProducts();
  return (
    products.find((product) => product.handle === "6a473aa4e2f7d6") ??
    products[0] ??
    null
  );
}

export async function estimateShipping(
  lines: CartLine[],
  recipient: Recipient,
) {
  const token = getToken();
  if (!token) {
    return [
      {
        id: "STANDARD",
        name: "Flat Rate (Estimated delivery: Jul 13–14)",
        rate: "4.49",
        currency: "USD",
        minDeliveryDays: 4,
        maxDeliveryDays: 6,
      },
    ];
  }

  const items = lines.map((line) => ({
    variant_id: Number(line.variantId),
    quantity: line.quantity,
  }));

  const response = await fetch(`${PRINTFUL_BASE}/shipping/rates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient,
      items,
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload.code !== 200) {
    throw new Error(payload.error?.message ?? "Could not resolve items for shipping.");
  }

  return (payload.result ?? []) as Array<{
    id: string;
    name: string;
    rate: string;
    currency: string;
    minDeliveryDays?: number;
    maxDeliveryDays?: number;
  }>;
}

export function hasPrintfulCredentials() {
  return Boolean(getToken());
}
