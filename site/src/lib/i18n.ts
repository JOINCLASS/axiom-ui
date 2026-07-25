export type Lang = "en" | "ja";

export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return lang === "ja" ? `/ja${clean === "/" ? "/" : clean}` : clean;
}

export function t(lang: Lang, en: string, ja: string): string {
  return lang === "ja" ? ja : en;
}
