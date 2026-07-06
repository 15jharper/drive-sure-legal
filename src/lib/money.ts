import type { Money } from "@/lib/types";

export function normalizeMoney(
  value: unknown,
  fallback?: Money,
): Money {
  const base = fallback ?? { amount: "0.00", currencyCode: "USD" };

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) {
      return { amount: parsed.toFixed(2), currencyCode: base.currencyCode };
    }
    return base;
  }

  if (value && typeof value === "object" && "amount" in value) {
    const amount = String((value as Money).amount ?? "").trim();
    const currencyCode =
      String((value as Money).currencyCode ?? base.currencyCode).trim() ||
      base.currencyCode;

    if (amount) {
      return { amount: Number(amount).toFixed(2), currencyCode };
    }
  }

  return base;
}

export function formatMoney(money: Money): string {
  const amount = Number(money.amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode || "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function sumMoney(lines: { price: Money; quantity: number }[]): number {
  return lines.reduce(
    (total, line) => total + Number(line.price.amount) * line.quantity,
    0,
  );
}
