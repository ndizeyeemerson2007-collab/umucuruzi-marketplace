export function formatRwf(amount: number): string {
  return `${amount.toLocaleString("en-US")} RWF`;
}

export function formatDeliveryRange(min: number, max: number): string {
  return `${min}\u2013${max} min`;
}
