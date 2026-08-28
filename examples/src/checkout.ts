export function chooseCheckout(flags: Record<string, boolean>) {
  return flags["checkout-v2"] ? "new checkout" : "old checkout";
}

export function cartShape(flags: Record<string, boolean>) {
  return flags["legacy-cart"] ? "legacy" : "current";
}
