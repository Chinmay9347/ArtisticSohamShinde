import type { CreateOrderRequest } from "@/types/api/order";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCommission(
  request: CreateOrderRequest,
): ValidationResult {
  const errors: string[] = [];

  const customer = request.customer;
  const portrait = request.portrait;
  const fulfillment = request.fulfillment;
  const delivery = request.delivery;
  const instructions = request.instructions;

  // Customer

  if (!customer?.fullName?.trim()) {
    errors.push(
      "Customer name is required."
    );
  }

  if (!customer?.email?.trim()) {
    errors.push(
      "Customer email is required."
    );
  }

  if (!customer?.phone?.trim()) {
    errors.push(
      "Customer phone is required."
    );
  }

  // Portrait

  if (!portrait?.packageId) {
    errors.push("Package is required.");
  }

  if (!portrait || portrait.subjects < 1) {
    errors.push(
      "At least one subject is required.",
    );
  } else if (portrait.subjects > 4) {
    errors.push(
      "A maximum of 4 subjects is supported.",
    );
  }

  if (!portrait?.size || !["A5","A4","A3","A2"].includes(portrait.size)) {
    errors.push("Portrait size is required.");
  }

  if (
    !portrait ||
    ![
      "portrait",
      "landscape",
      "square",
    ].includes(portrait.orientation)
  ) {
    errors.push(
      "Invalid orientation."
    );
  }

  // Fulfillment

  // if (
  //   !fulfillment ||
  //   ![
  //     "digital",
  //     "printed",
  //     "framed",
  //   ].includes(fulfillment.type)
  // ) {
  //   errors.push(
  //     "Invalid fulfillment method."
  //   );
  // }
  
  // Fulfillment
  if (
    !fulfillment ||
    ![
      "digital",
      "sketched",
      "framed",
      "printed",
    ].includes(fulfillment.type)
  ) {
    errors.push("Invalid fulfillment method.");
  }

  if (
    fulfillment?.type === "digital" &&
    portrait?.framing
  ) {
    errors.push(
      "Digital fulfillment cannot include framing.",
    );
  }

  // Delivery

  if (fulfillment?.type !== "digital") {
    if (
      !delivery?.addressLine1?.trim()
    ) {
      errors.push(
        "Delivery address is required."
      );
    }

    if (!delivery?.city?.trim()) {
      errors.push(
        "Delivery city is required."
      );
    }

    if (!delivery?.state?.trim()) {
      errors.push(
        "Delivery state is required."
      );
    }

    if (!delivery?.pincode?.trim()) {
      errors.push(
        "Delivery PIN code is required."
      );
    }

    if (!delivery?.country?.trim()) {
      errors.push(
        "Delivery country is required."
      );
    }
  }

  // At least one customer reference photo is mandatory for every commission.
  // The gallery artwork reference does not replace the customer's own reference photo.
  if (!Array.isArray(request.referencePhotos) || request.referencePhotos.length < 1) {
    errors.push("At least 1 reference photo is required.");
  }


  // Instructions

  if (!instructions?.specialInstructions?.trim()) {
    errors.push("Special instructions are required.");
  }

  if (
    (instructions?.specialInstructions ?? "")
      .length > 1500
  ) {
    errors.push(
      "Special instructions are too long."
    );
  }

  if (
    (instructions?.giftMessage ?? "")
      .length > 300
  ) {
    errors.push(
      "Gift message is too long."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

//02/08/2026
// import type { CreateOrderRequest } from "@/types/api/order";

// export interface ValidationResult {
//   valid: boolean;
//   errors: string[];
// }

// export function validateCommission(
//   request: CreateOrderRequest,
// ): ValidationResult {
//   const errors: string[] = [];

//   // Customer

//   if (!request.customer.fullName.trim()) {
//     errors.push("Customer name is required.");
//   }

//   if (!request.customer.email.trim()) {
//     errors.push("Customer email is required.");
//   }

//   if (!request.customer.phone.trim()) {
//     errors.push("Customer phone is required.");
//   }

//   // Portrait

//   if (!request.portrait.packageId) {
//     errors.push("Package is required.");
//   }

//   if (request.portrait.subjects < 1) {
//     errors.push("At least one subject is required.");
//   }

//   if (
//     !["portrait", "landscape", "square"].includes(
//       request.portrait.orientation,
//     )
//   ) {
//     errors.push("Invalid orientation.");
//   }

//   // Photos

//   if (request.referencePhotos.length === 0) {
//     errors.push(
//       "At least one reference photo is required.",
//     );
//   }

//   // Instructions

//   if (
//     request.instructions.specialInstructions.length > 1500
//   ) {
//     errors.push(
//       "Special instructions are too long.",
//     );
//   }

//   if (request.instructions.giftMessage.length > 300) {
//     errors.push("Gift message is too long.");
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   };
// }