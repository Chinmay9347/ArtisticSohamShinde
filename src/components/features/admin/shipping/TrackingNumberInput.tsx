interface Props {
  value: string;
  onChange(value: string): void;
}

export default function TrackingNumberInput({
  value,
  onChange,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder="Tracking Number"
      className="w-full rounded-xl border p-3"
    />
  );
}