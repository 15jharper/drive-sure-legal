export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText?: string | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  image?: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  featuredImage: ProductImage;
  images: ProductImage[];
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  options: { id: string; name: string; values: string[] }[];
  variants: ProductVariant[];
  category: "men" | "women";
};

export type CartLine = {
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  image: ProductImage;
  price: Money;
  quantity: number;
};

export type Recipient = {
  name: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  zip: string;
  country_code: string;
};

export type ShippingRate = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  minDays: number;
  maxDays: number;
};

export type Story = {
  name: string;
  text: string;
  at: string;
};
