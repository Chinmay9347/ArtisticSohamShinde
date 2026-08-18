"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type {
    CommissionContextType,
    CommissionFormData,
    CommissionStepItem,
} from "@/types/commission";

const STEPS: CommissionStepItem[] = [
    {
        id: "package",
        title: "Choose Package",
        description: "Select your portrait package.",
    },
    {
        id: "customer",
        title: "Customer Details",
        description: "Enter your contact information.",
    },
    {
        id: "portrait",
        title: "Portrait Details",
        description: "Configure your artwork.",
    },
    {
        id: "instructions",
        title: "Special Instructions",
        description: "Provide additional information.",
    },
    {
        id: "review",
        title: "Review Order",
        description: "Verify all entered information.",
    },
    {
        id: "success",
        title: "Order Complete",
        description: "Commission submitted successfully.",
    },
];

const INITIAL_FORM_DATA: CommissionFormData = {
    offerCode: "",
    referralCode: "",
    rewardPointsUsed: 0,
    package: "classic",

    customer: {
        fullName: "",
        email: "",
        phone: "",
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

    delivery: {
        addressLine1: "",
        addressLine2: "",

        city: "",
        state: "",

        pincode: "",

        country: "India",
    },

    fulfillment: {
        type: "printed",
     },
};

const CommissionContext =
    createContext<CommissionContextType | undefined>(
        undefined
    );

interface CommissionProviderProps {
    children: ReactNode;
}

export function CommissionProvider({
    children,
}: CommissionProviderProps) {
    const [currentStep, setCurrentStep] =
        useState(0);

    const [formData, setFormData] =
        useState<CommissionFormData>(
            INITIAL_FORM_DATA
        );

    const nextStep = () => {
        setCurrentStep((previous) =>
            Math.min(previous + 1, STEPS.length - 1)
        );
    };

    const previousStep = () => {
        setCurrentStep((previous) =>
            Math.max(previous - 1, 0)
        );
    };

    const goToStep = (step: number) => {
        if (
            step >= 0 &&
            step < STEPS.length
        ) {
            setCurrentStep(step);
        }
    };

    const updateFormData = (
        data: Partial<CommissionFormData>
    ) => {
        setFormData((previous) => ({
            ...previous,
            ...data,
        }));
    };

    const resetForm = () => {
        setCurrentStep(0);
        setFormData(INITIAL_FORM_DATA);
    };

    const value = useMemo<CommissionContextType>(
        () => ({
            currentStep,
            steps: STEPS,
            formData,
            nextStep,
            previousStep,
            goToStep,
            updateFormData,
            resetForm,
        }),
        [currentStep, formData]
    );

    return (
        <CommissionContext.Provider value={value}>
            {children}
        </CommissionContext.Provider>
    );
}

export function useCommissionContext() {
    const context =
        useContext(CommissionContext);

    if (!context) {
        throw new Error(
            "useCommissionContext must be used inside CommissionProvider."
        );
    }

    return context;
}