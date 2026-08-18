interface Props {
  orderNumber: string;
}

export default function TrackingHeader({
  orderNumber,
}: Props) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
        Customer Dashboard
      </p>

      <h1 className="mt-2 font-cinzel text-4xl">
        Track Order
      </h1>

      <p className="mt-3 text-zinc-500">
        Order #{orderNumber}
      </p>
    </div>
  );
}