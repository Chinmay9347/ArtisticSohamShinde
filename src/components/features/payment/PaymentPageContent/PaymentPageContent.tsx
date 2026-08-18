"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

import type { PaymentPageContentProps } from "./PaymentPageContent.types";

import { ReceiptUpload } from "../ReceiptUpload";

import { uploadImage } from "@/services/cloudinary";
import type { PaymentMethod } from "@/types/payment";
import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";

// import type { PaymentAccount } from "@/types/payment-account";

// export interface PaymentPageContentProps {
//   order: Order;
//   paymentAccounts: PaymentAccount[];
// }

export function PaymentPageContent({
  order,
  paymentAccounts,
}: PaymentPageContentProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] =
  useState<PaymentMethod>("UPI");
  const [loading, setLoading] =
    useState(false);
  const [receipt, setReceipt] =
    useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  // const submit = async () => {
  //   if (!receipt) {
  //     alert("Please select your payment receipt.");
  //     return;
  //   }

  //   if (!transactionId.trim()) {
  //     alert("Please enter your Transaction / UTR / Reference ID.");
  //     return;
  //   }

  //   if (!confirmed) {
  //     alert("Please confirm that you have completed the payment.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const uploaded = await uploadImage(
  //       receipt,
  //       CLOUDINARY_FOLDERS.PAYMENT_PROOFS
  //     );

  //     if (!user) {
  //       throw new Error(
  //         "Please sign in before submitting payment.",
  //       );
  //     }

  //     const idToken =
  //       await user.getIdToken();

  //     const response = await fetch(
  //       "/api/payments",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${idToken}`,
  //         },
  //         body: JSON.stringify({
  //           orderId: order.id,
  //           method: paymentMethod,
  //           transactionId:
  //             transactionId.trim(),
  //           receipt: {
  //             fileName: receipt.name,
  //             publicId:
  //               uploaded.publicId,
  //             url:
  //               uploaded.secureUrl,
  //           },
  //         }),
  //       },
  //     );

  //     const result =
  //       await response.json();

  //     if (!response.ok) {
  //       throw new Error(
  //         result.message ??
  //           "Unable to submit payment.",
  //       );
  //     }

  //     window.location.href = `/orders/${order.id}`;
  //   } catch (error) {
  //     console.error(error);

  //     alert(
  //       "Unable to submit payment. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const submit = async () => {
    if (!user) {
      alert(
        "Please sign in before submitting payment.",
      );
      return;
    }

    if (!receipt) {
      alert(
        "Please select your payment receipt.",
      );
      return;
    }

    if (!transactionId.trim()) {
      alert(
        "Please enter your Transaction / UTR / Reference ID.",
      );
      return;
    }

    if (!confirmed) {
      alert(
        "Please confirm that you have completed the payment.",
      );
      return;
    }

    try {
      setLoading(true);

      /*
      * Get a fresh Firebase ID token before
      * starting the Cloudinary/payment flow.
      */
      const idToken =
        await user.getIdToken(true);

      /*
      * Upload receipt to Cloudinary.
      */
      const uploaded =
        await uploadImage(
          receipt,
          CLOUDINARY_FOLDERS.PAYMENT_PROOFS,
        );

      if (!uploaded?.publicId) {
        throw new Error(
          "Receipt upload failed: Cloudinary did not return a public ID.",
        );
      }

      if (!uploaded?.secureUrl) {
        throw new Error(
          "Receipt upload failed: Cloudinary did not return a secure URL.",
        );
      }

      /*
      * Submit payment proof to Firestore
      * through the protected API.
      */
      const response = await fetch(
        "/api/payments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${idToken}`,
          },

          body: JSON.stringify({
            orderId: order.id,

            method: paymentMethod,

            transactionId:
              transactionId.trim(),

            receipt: {
              fileName: receipt.name,

              publicId:
                uploaded.publicId,

              url:
                uploaded.secureUrl,
            },
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ??
            "Unable to submit payment.",
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ??
            "Payment submission was not completed.",
        );
      }

      /*
      * Payment has been successfully written
      * to Firestore.
      */
      window.location.href =
        `/orders/${order.id}`;
    } catch (error) {
      console.error(
        "Payment submission failed:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit payment. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };
  const upiAccounts = paymentAccounts.filter(
    (account) => account.type === "upi"
  );

  const bankAccounts = paymentAccounts.filter(
    (account) => account.type === "bank"
  );
  const [selectedUpiId] = useState(
    upiAccounts[0]?.id ?? ""
  );

  const [selectedBankId] = useState(
    bankAccounts[0]?.id ?? ""
  );
  const selectedUpi =
    upiAccounts.find((a) => a.id === selectedUpiId) ??
    upiAccounts[0];

  const selectedBank =
    bankAccounts.find((a) => a.id === selectedBankId) ??
    bankAccounts[0];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">

      <h1 className="text-4xl font-bold">
        Complete Payment
      </h1>

      <p className="mt-2 text-neutral-500">
        Order #{order.orderNumber}
      </p>

      <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Please verify your order before uploading the payment receipt.
            </p>
          </div>

          <div className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium">
            {order.orderNumber}
          </div>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="space-y-4">

            <SummaryRow
              label="Package"
              value={order.portrait.packageId}
            />

            <SummaryRow
              label="Subjects"
              value={String(order.portrait.subjects)}
            />

            <SummaryRow
              label="Orientation"
              value={order.portrait.orientation}
            />

            <SummaryRow
              label="Customer"
              value={order.customer.fullName}
            />

          </div>

          <div className="space-y-4">

            <SummaryRow
              label="Email"
              value={order.customer.email}
            />

            <SummaryRow
              label="Phone"
              value={order.customer.phone}
            />

            <SummaryRow
              label="Payment Status"
              value={order.payment.status}
            />

            <SummaryRow
              label="Order Status"
              value={order.status}
            />

          </div>

        </div>

        <div className="mt-8 border-t pt-6">

          <div className="flex items-center justify-between">

            <span className="text-lg font-medium">
              Total Amount
            </span>

            <span className="text-3xl font-bold">
              ₹
              {order.payment.amount.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-xl border p-6">

        <h2 className="text-xl font-semibold">
          Select Payment Method
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <button
            type="button"
            onClick={() => setPaymentMethod("UPI")}
            className={`rounded-xl border p-5 text-left transition ${
              paymentMethod === "UPI"
                ? "border-yellow-500 bg-yellow-50"
                : "hover:border-neutral-400"
            }`}
          >
            <div className="text-2xl">📱</div>

            <h3 className="mt-3 font-semibold">
              UPI
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Pay using any UPI app.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("QR")}
            className={`rounded-xl border p-5 text-left transition ${
              paymentMethod === "QR"
                ? "border-yellow-500 bg-yellow-50"
                : "hover:border-neutral-400"
            }`}
          >
            <div className="text-2xl">🔳</div>

            <h3 className="mt-3 font-semibold">
              QR Code
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Scan & Pay
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("BANK_TRANSFER")}
            className={`rounded-xl border p-5 text-left transition ${
              paymentMethod === "BANK_TRANSFER"
                ? "border-yellow-500 bg-yellow-50"
                : "hover:border-neutral-400"
            }`}
          >
            <div className="text-2xl">🏦</div>

            <h3 className="mt-3 font-semibold">
              Bank Transfer
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              NEFT / IMPS / RTGS
            </p>
          </button>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Payment Information
            </h2>

            <p className="mt-1 text-neutral-500">
              Complete your payment using one of the methods below.
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Secure Payment
          </span>

        </div>

        {paymentMethod === "UPI" && (
          <div className="mt-8 space-y-6">

            <div>
              <p className="text-sm text-neutral-500">
                UPI ID
              </p>

              <div className="mt-2 flex items-center justify-between rounded-xl border p-4">

                <span className="font-semibold">
                  {selectedUpi?.upiId}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      selectedUpi?.upiId ?? ""
                    )
                  }
                  className="rounded-lg border px-4 py-2 hover:bg-neutral-100"
                >
                  Copy
                </button>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                if (!selectedUpi?.upiId) {
                  alert("UPI payment details are not available.");
                  return;
                }

                const upiUrl =
                  `upi://pay?pa=${encodeURIComponent(
                    selectedUpi.upiId
                  )}` +
                  `&pn=${encodeURIComponent(
                    selectedUpi.accountHolder ?? ""
                  )}` +
                  `&am=${encodeURIComponent(
                    String(order.payment.amount)
                  )}` +
                  `&cu=INR`;

                window.location.href = upiUrl;
              }}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              Open UPI App
            </button>

          </div>
        )}

        {paymentMethod === "QR" && (
          <div className="mt-8 flex justify-center">

            {selectedUpi?.qrImage ? (
              <img
                src={selectedUpi.qrImage}
                alt={selectedUpi.title ?? "UPI QR Code"}
                className="h-72 w-72 rounded-xl border object-contain"
              />
            ) : (
              <div className="flex h-72 w-72 items-center justify-center rounded-xl border bg-neutral-50 text-center text-sm text-neutral-500">
                QR code is not available.
              </div>
            )}

          </div>
        )}

        {paymentMethod === "BANK_TRANSFER" && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <InfoRow
              label="Account Name"
              value={selectedBank?.accountHolder ?? "Not available"}
            />

            <InfoRow
              label="Bank"
              value={selectedBank?.bankName ?? "Not available"}
            />

            <InfoRow
              label="Account Number"
              value={
                selectedBank?.accountNumber ??
                "Not available"
              }
            />

            <InfoRow
              label="IFSC"
              value={
                selectedBank?.ifsc ??
                "Not available"
              }
            />

            <InfoRow
              label="Branch"
              value={
                selectedBank?.branch ??
                "Not available"
              }
            />

          </div>
        )}

      </div>

      <ReceiptUpload
          selectedFile={receipt}
          onFileSelected={setReceipt}
          uploading={loading}
      />
      <div className="mt-8 rounded-2xl border bg-white p-8">

        <h2 className="text-xl font-semibold">
          Payment Verification
        </h2>

        <div className="mt-6">

          <label className="mb-2 block font-medium">
            Transaction / UTR / Reference ID
          </label>

          <input
            type="text"
            value={transactionId}
            onChange={(e) =>
              setTransactionId(e.target.value)
            }
            placeholder="Enter your UPI / UTR / Bank Reference Number"
            className="w-full rounded-xl border p-4"
          />

          <p className="mt-2 text-sm text-neutral-500">
            This helps us verify your payment much faster.
          </p>

        </div>

        <label className="mt-8 flex cursor-pointer items-start gap-3">

          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) =>
              setConfirmed(e.target.checked)
            }
            className="mt-1"
          />

          <span className="text-sm text-neutral-600">
            I confirm that I have transferred the exact amount
            and the transaction/reference number entered above
            belongs to this payment.
          </span>

        </label>

      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="mt-8 rounded-lg bg-black px-8 py-4 text-white"
      >
        {loading
          ? "Submitting..."
          : "Submit Payment"}
      </button>

    </main>
  );
}
function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b pb-3">

      <span className="text-neutral-500">
        {label}
      </span>

      <span className="ml-auto w-full max-w-[55%] break-words text-right font-medium">
        {value}
      </span>

    </div>
  );
}
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-4">

      <p className="text-sm text-neutral-500">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>

    </div>
  );
}