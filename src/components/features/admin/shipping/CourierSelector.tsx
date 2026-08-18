interface Props {
  value: string;
  onChange(value: string): void;
}

const COURIERS = [
  "Blue Dart",
  "DTDC",
  "Delhivery",
  "India Post",
  "XpressBees",
];

export default function CourierSelector({
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="w-full rounded-xl border p-3"
    >
      <option value="">
        Select Courier
      </option>

      {COURIERS.map((courier) => (
        <option
          key={courier}
          value={courier}
        >
          {courier}
        </option>
      ))}
    </select>
  );
}