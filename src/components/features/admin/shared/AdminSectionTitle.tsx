interface AdminSectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function AdminSectionTitle({
  title,
  subtitle,
}: AdminSectionTitleProps) {
  return (
    <div className="mb-8">

      <h2 className="text-3xl font-semibold">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-zinc-500">
          {subtitle}
        </p>
      )}

    </div>
  );
}