export const getToken = (): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const raw = localStorage.getItem("user-storage");
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    return parsed.state?.accessToken ?? undefined;
  } catch {
    return undefined;
  }
};

export const getRefreshToken = (): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const raw = localStorage.getItem("user-storage");
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    return parsed.state?.refreshToken ?? undefined;
  } catch {
    return undefined;
  }
};