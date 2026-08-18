import { SectionHeaderProps } from "./SectionHeader.types";
import { sectionHeaderStyles } from "./SectionHeader.styles";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={`${sectionHeaderStyles.wrapper} ${
        align === "center"
          ? sectionHeaderStyles.center
          : sectionHeaderStyles.left
      }`}
    >
      {eyebrow && (
        <p className={sectionHeaderStyles.eyebrow}>
          {eyebrow}
        </p>
      )}

      <h2 className={sectionHeaderStyles.title}>
        {title}
      </h2>

      {description && (
        <p className={sectionHeaderStyles.description}>
          {description}
        </p>
      )}
    </div>
  );
}