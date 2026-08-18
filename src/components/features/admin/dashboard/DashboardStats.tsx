interface DashboardStatsProps {
  totalOrders: number;
  paymentPending: number;
  paymentVerified: number;
  completed: number;
}

const cards = [
  {
    key: "totalOrders",
    title: "Total Orders",
  },
  {
    key: "paymentPending",
    title: "Payment Pending",
  },
  {
    key: "paymentVerified",
    title: "Verified Payments",
  },
  {
    key: "completed",
    title: "Completed Orders",
  },
] as const;

export default function DashboardStats({
  totalOrders,
  paymentPending,
  paymentVerified,
  completed,
}: DashboardStatsProps) {
  const values = {
    totalOrders,
    paymentPending,
    paymentVerified,
    completed,
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (

        <div
          key={card.key}
          className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >

          <p className="text-sm text-zinc-500">
            {card.title}
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {values[card.key]}
          </h2>

        </div>

      ))}

    </div>
  );
}