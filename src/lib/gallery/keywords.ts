export function generateSearchKeywords(
  title: string,
  category: string,
  tags: string[]
): string[] {
  const values = [
    title,
    category,
    ...tags,
  ];

  const keywords = new Set<string>();

  values.forEach((value) => {
    value
      .toLowerCase()
      .split(/\s+/)
      .forEach((word) => {
        const trimmed = word.trim();

        if (trimmed.length > 1) {
          keywords.add(trimmed);
        }
      });
  });

  return [...keywords];
}