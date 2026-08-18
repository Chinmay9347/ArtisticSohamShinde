export type SortDirection = "asc" | "desc";

export function sortByString<T>(
  items: T[],
  selector: (item: T) => string,
  direction: SortDirection = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const result = selector(a).localeCompare(selector(b));

    return direction === "asc" ? result : -result;
  });
}

export function sortByNumber<T>(
  items: T[],
  selector: (item: T) => number,
  direction: SortDirection = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const result = selector(a) - selector(b);

    return direction === "asc" ? result : -result;
  });
}