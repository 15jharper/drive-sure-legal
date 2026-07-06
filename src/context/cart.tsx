"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, ProductImage } from "@/lib/types";
import { normalizeMoney, sumMoney } from "@/lib/money";

const STORAGE_KEY = "nk_cart_v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (line: Omit<CartLine, "price"> & { price: unknown }) => void;
  removeLine: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored));
    } catch {
      // ignore invalid cart data
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addLine = useCallback(
    (line: Omit<CartLine, "price"> & { price: unknown }) => {
      const normalized: CartLine = {
        ...line,
        price: normalizeMoney(line.price),
      };

      setLines((current) => {
        const existing = current.find(
          (item) => item.variantId === normalized.variantId,
        );
        if (existing) {
          return current.map((item) =>
            item.variantId === normalized.variantId
              ? { ...item, quantity: item.quantity + normalized.quantity }
              : item,
          );
        }
        return [...current, normalized];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeLine = useCallback((variantId: string) => {
    setLines((current) => current.filter((line) => line.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((current) =>
      current
        .map((line) =>
          line.variantId === variantId ? { ...line, quantity } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(() => sumMoney(lines), [lines]);

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        subtotal,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addLine,
        removeLine,
        updateQuantity,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function toProductImage(
  image: ProductImage | string | null | undefined,
  fallbackTitle: string,
): ProductImage {
  if (!image) return { url: "", altText: fallbackTitle };
  if (typeof image === "string") return { url: image, altText: fallbackTitle };
  return image;
}
