const DECIMALS = 9;

export function parseDecimalToBigInt(amount: string, decimals = DECIMALS): bigint | null {
    if (!amount) return null;
    const cleaned = amount.trim();
    if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
    const [whole, frac = ""] = cleaned.split(".");
    const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
    return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded || "0");
  } 
export function bigIntToDecimalString(value: bigint, decimals = DECIMALS): string {
    const base = 10n ** BigInt(decimals);
    const whole = value / base;
    const frac = value % base;
    if (frac === 0n) return whole.toString();
    let fracStr = frac.toString().padStart(decimals, "0");
    fracStr = fracStr.replace(/0+$/, "");
    return `${whole.toString()}.${fracStr}`;
  }