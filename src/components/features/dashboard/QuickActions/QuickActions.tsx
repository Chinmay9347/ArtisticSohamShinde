import {
  ShoppingBag,
  Image as GalleryIcon,
  User,
  PlusCircle,
} from "lucide-react";

import { QuickActionCard } from "../cards/QuickActionCard";

export function QuickActions() {
  return (
    <section>
      <h2 className="mb-6 font-heading text-2xl font-semibold">
        Quick Actions
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <QuickActionCard
          title="New Commission"
          description="Start a custom portrait order."
          href="/commission"
          icon={<PlusCircle size={24} />}
        />

        <QuickActionCard
          title="Gallery"
          description="Browse completed artworks."
          href="/gallery"
          icon={<GalleryIcon size={24} />}
        />

        <QuickActionCard
          title="Profile"
          description="Update your account."
          href="/profile"
          icon={<User size={24} />}
        />

        <QuickActionCard
          title="Orders"
          description="Track your commissions."
          href="/orders"
          icon={<ShoppingBag size={24} />}
        />

      </div>
    </section>
  );
}