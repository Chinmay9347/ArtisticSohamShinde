import type {
  OfferDocument,
} from "@/types/offer";

export function mapOfferDocument(
  id: string,
  data: Record<string, unknown>,
): OfferDocument {
  const applicability =
    (data.applicability as Record<string, unknown>) ??
    {};

  return {
    id,

    name:
      (data.name as string) ?? "",

    code:
      (data.code as string) ?? "",

    description:
      (data.description as string) ?? "",

    enabled:
      (data.enabled as boolean) ?? false,

    discountType:
      data.discountType as OfferDocument["discountType"],

    discountValue:
      Number(data.discountValue ?? 0),

    minimumOrderValue:
      data.minimumOrderValue == null
        ? null
        : Number(data.minimumOrderValue),

    maximumDiscount:
      data.maximumDiscount == null
        ? null
        : Number(data.maximumDiscount),

    usageLimit:
      data.usageLimit == null
        ? null
        : Number(data.usageLimit),

    usageCount:
      Number(data.usageCount ?? 0),

    perCustomerLimit:
      data.perCustomerLimit == null
        ? null
        : Number(data.perCustomerLimit),

    stackingMode:
      data.stackingMode as OfferDocument["stackingMode"],

    discountBase:
      (data.discountBase as OfferDocument["discountBase"]) ?? "DISCOUNTED_ITEM_TOTAL",

    discountComponents:
      Array.isArray(data.discountComponents)
        ? (data.discountComponents as OfferDocument["discountComponents"])
        : ["PACKAGE", "SUBJECTS", "FRAMING"],

    freeDelivery:
      Boolean(data.freeDelivery ?? false),

    freeDeliveryMinimumOrderValue:
      data.freeDeliveryMinimumOrderValue == null
        ? null
        : Number(data.freeDeliveryMinimumOrderValue),

    applicability: {
      packageIds:
        (applicability.packageIds as OfferDocument["applicability"]["packageIds"]) ??
        [],

      fulfillmentTypes:
        (applicability.fulfillmentTypes as OfferDocument["applicability"]["fulfillmentTypes"]) ??
        [],

      premiumFrame:
        (applicability.premiumFrame as OfferDocument["applicability"]["premiumFrame"]) ??
        "ANY",
    },

    startAt:
      data.startAt,

    endAt: data.endAt,

    audience: (data.audience as OfferDocument["audience"]) ?? undefined,

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}