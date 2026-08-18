interface Props {
  courier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export default function ShippingTracker({
  courier,
  trackingNumber,
  trackingUrl,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">
        Shipping
      </h2>

      <div className="mt-6 space-y-3">
        <p>
          <strong>Courier:</strong>{" "}
          {courier ?? "Not assigned"}
        </p>

        <p>
          <strong>Tracking:</strong>{" "}
          {trackingNumber ?? "Not available"}
        </p>

        {trackingUrl && (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Track Shipment
          </a>
        )}
      </div>
    </div>
  );
}