"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import type {
  CommissionContextType,
  CommissionFormData,
  CommissionStepItem,
} from "@/types/commission";


const steps: CommissionStepItem[] = [
  { id: "package", title: "Package", description: "Selected commission package" },
  { id: "customer", title: "Customer", description: "Your contact information" },
  { id: "portrait", title: "Portrait", description: "Portrait configuration" },
  { id: "photos", title: "Reference Photos", description: "Upload your reference photos" },
  { id: "instructions", title: "Instructions", description: "Additional requirements" },
  { id: "review", title: "Review", description: "Confirm your order" },
];

const initialData: CommissionFormData = {
  offerCode: "",
  referralCode: "",
  rewardPointsUsed: 0,
  package: "classic",
  customer: {
    fullName: "",
    email: "",
    phone: "",
  },
  delivery: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  },
  fulfillment: {
    type: "sketched",
  },
  portrait: {
    subjects: 1,
    size: "A5",
    orientation: "portrait",
    framing: false,
  },
  photos: [],
  instructions: {
    specialInstructions: "",
    giftMessage: "",
  },
};

export function useCommission(options?: { scope?: string; fresh?: boolean }): CommissionContextType {
  const { user } = useAuth();
  const scope = options?.scope ?? "default";
  const fresh = Boolean(options?.fresh);
  const isGuest = !user;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<CommissionFormData>(initialData);

  const [restoring, setRestoring] = useState(true);

  const sessionKey = `artistic-soham-commission:${scope}`;

  useEffect(() => {
    let active = true;
    if (fresh) { setRestoring(false); return () => { active = false; }; }
    try {
      const raw = window.sessionStorage.getItem(sessionKey);
      if (raw) {
        const draft = JSON.parse(raw) as { formData?: CommissionFormData; currentStep?: number };
        if (draft.formData) setFormData(draft.formData);
        if (typeof draft.currentStep === "number") setCurrentStep(Math.min(Math.max(draft.currentStep, 0), steps.length - 1));
      }
    } catch (error) { console.warn("Unable to restore temporary commission session:", error); }
    if (active) setRestoring(false);
    return () => { active = false; };
  }, [fresh, sessionKey]);

  useEffect(() => {
    if (restoring) return;
    const timer = window.setTimeout(() => {
      try {
        const safeForm = { ...formData, photos: formData.photos.map(({ file, ...photo }) => photo) };
        window.sessionStorage.setItem(sessionKey, JSON.stringify({ formData: safeForm, currentStep, savedAt: Date.now() }));
      } catch (error) { console.warn("Unable to persist temporary commission session:", error); }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [formData, currentStep, restoring, sessionKey]);

  const nextStep = () => {
    setCurrentStep((previous) =>
      Math.min(
        previous + 1,
        steps.length - 1,
      ),
    );
  };

  const previousStep = () => {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0),
    );
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const updateFormData = (
    data: Partial<CommissionFormData>,
  ) => {
    setFormData((previous) => ({
      ...previous,

      customer: {
        ...previous.customer,
        ...(data.customer ?? {}),
      },

      portrait: {
        ...previous.portrait,
        ...(data.portrait ?? {}),
      },

      instructions: {
        ...previous.instructions,
        ...(data.instructions ?? {}),
      },

      delivery: {
        ...previous.delivery,
        ...(data.delivery ?? {}),
      },

      fulfillment: {
        ...previous.fulfillment,
        ...(data.fulfillment ?? {}),
      },

      photos:
        data.photos ?? previous.photos,

      package:
        data.package ?? previous.package,

      offerCode:
        data.offerCode ?? previous.offerCode,

      offerCodes:
        data.offerCodes ?? previous.offerCodes,

      referralCode:
        data.referralCode ?? previous.referralCode,

      rewardPointsUsed:
        data.rewardPointsUsed ?? previous.rewardPointsUsed ?? 0,

      galleryArtwork:
        data.galleryArtwork ?? previous.galleryArtwork,
    }));
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFormData(initialData);
    try { window.sessionStorage.removeItem(sessionKey); } catch { /* ignore */ }
  };

  return useMemo(
    () => ({
      currentStep,
      steps,
      formData,
      nextStep,
      previousStep,
      goToStep,
      updateFormData,
      resetForm,
    }),
    [currentStep, formData],
  );
}
