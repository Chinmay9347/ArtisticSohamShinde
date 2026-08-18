import AdminCard from "../shared/AdminCard";

import type { CustomerDetails } from "@/types/order";

interface AdminCustomerCardProps {
  customer: CustomerDetails;
}

export default function AdminCustomerCard({
  customer,
}: AdminCustomerCardProps) {
  return (
    <AdminCard>

      <h2 className="text-2xl font-semibold">
        Customer Information
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <div>

          <p className="text-sm text-zinc-500">
            Full Name
          </p>

          <p className="mt-1">
            {customer.fullName}
          </p>

        </div>

        <div>

          <p className="text-sm text-zinc-500">
            Email
          </p>

          <p className="mt-1">
            {customer.email}
          </p>

        </div>

        <div>

          <p className="text-sm text-zinc-500">
            Phone
          </p>

          <p className="mt-1">
            {customer.phone}
          </p>

        </div>

      </div>

    </AdminCard>
  );
}