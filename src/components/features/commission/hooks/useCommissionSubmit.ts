"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import type { CommissionFormData } from "@/types/commission";
import { toast } from "sonner";
import { uploadImage } from "@/services/cloudinary";
import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";

interface UseCommissionSubmitProps {
  formData: CommissionFormData;
}

export function useCommissionSubmit({
  formData,
}: UseCommissionSubmitProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const submitOrder = async () => {
    if (authLoading) {
      toast.info(
        "Checking your login session. Please try again in a moment.",
      );
      return;
    }

    /*
     * Guest checkout is intentionally supported through the
     * wizard, but the final order creation requires a customer
     * Firebase Auth session.
     *
     * The complete wizard (including File objects) is persisted
     * in IndexedDB by useCommission(), so the user can return
     * after login without losing the order.
     */
    if (!user) {
      const redirect = encodeURIComponent(
        `/commission?package=${formData.package}&resume=1`,
      );

      toast.info(
        "Please sign in to create your commission. Your order draft has been saved.",
      );

      router.push(
        `/login?redirect=${redirect}`,
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const idToken = await user.getIdToken();

      if (formData.photos.length < 1) {
        throw new Error("At least 1 reference photo is required.");
      }

      const uploadedPhotos = [];
      for (const photo of formData.photos) {
        if (!photo.file) {
          throw new Error(`Reference photo \"${photo.fileName}\" is no longer available. Please select it again.`);
        }
        const uploaded = await uploadImage(
          photo.file,
          CLOUDINARY_FOLDERS.COMMISSION_REFERENCES,
        );
        uploadedPhotos.push({
          fileName: photo.fileName,
          publicId: uploaded.publicId,
          url: uploaded.secureUrl,
          width: uploaded.width,
          height: uploaded.height,
          size: uploaded.bytes,
        });
      }

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            offerCode:
              formData.offerCode?.trim() ||
              undefined,

            offerCodes: formData.offerCodes?.length ? formData.offerCodes : undefined,

            referralCode:
              formData.referralCode?.trim() ||
              undefined,

            rewardPointsUsed: Math.max(0, Number(formData.rewardPointsUsed ?? 0)),

            customer: {
              uid: user.uid,
              ...formData.customer,
              email:
                user.email ??
                formData.customer.email,
            },

            portrait: {
              packageId: formData.package,
              subjects:
                formData.portrait.subjects,
              size:
                formData.portrait.size,
              orientation:
                formData.portrait.orientation,
              framing:
                formData.portrait.framing,
            },

            fulfillment:
              formData.fulfillment,

            delivery:
              formData.delivery,

            instructions:
              formData.instructions,

            referencePhotos:
              uploadedPhotos,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to create your order.",
        );
      }

      try {
        window.sessionStorage.removeItem(`artistic-soham-commission:package-${formData.package}`);
      } catch { /* ignore temporary session cleanup errors */ }

      router.push(
        `/payment/${result.orderId}`,
      );
    } catch (error) {
      console.error(
        "Commission submission failed:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOrder,
    isSubmitting,
  };
}
