"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/services/cloudinary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";
import {
  paymentAccountSchema,
} from "./PaymentAccountForm.schema";
import type {
  PaymentAccountFormProps,
  // PaymentAccountFormValues,
} from "./PaymentAccountForm.types";

export function PaymentAccountForm({
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = "Save Payment Account",
}: PaymentAccountFormProps) {
// export function PaymentAccountForm({
//   initialValues,
//   onSubmit,
//   loading = false,
// }: PaymentAccountFormProps) {

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  // } = useForm<PaymentAccountFormValues>({
  //   resolver: zodResolver(paymentAccountSchema),
  const [uploadingQr, setUploadingQr] = useState(false);
  const [qrPreview, setQrPreview] = useState(
    initialValues?.qrImage ?? ""
  );
  const handleQrUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingQr(true);

      setQrPreview(URL.createObjectURL(file));

      const uploaded = await uploadImage(
        file,
        CLOUDINARY_FOLDERS.PAYMENT_ACCOUNTS
      );

      setQrPreview(uploaded.secureUrl);

      // Update react-hook-form value
      setValue("qrImage", uploaded.secureUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to upload QR image.");
    } finally {
      setUploadingQr(false);
    }
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<
    z.input<typeof paymentAccountSchema>,
    unknown,
    z.output<typeof paymentAccountSchema>
  >({
  resolver: zodResolver(paymentAccountSchema),

    defaultValues: {
      title: "",

      type: "upi",

      accountHolder: "",

      description: "",

      enabled: true,

      displayOrder: 1,

      upiId: "",

      qrImage: "",

      bankName: "",

      accountNumber: "",

      ifsc: "",

      branch: "",

      ...initialValues,
    },
  });

  const type = watch("type");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl border bg-white p-8"
    >
      <div>

        <label className="mb-2 block font-medium">
          Account Title
        </label>

        <input
          {...register("title")}
          className="w-full rounded-lg border p-3"
        />

      </div>

      <div>

        <label className="mb-2 block font-medium">
          Payment Type
        </label>

        <select
          {...register("type")}
          className="w-full rounded-lg border p-3"
        >
          <option value="upi">
            UPI
          </option>

          <option value="bank">
            Bank Account
          </option>

        </select>

      </div>

      <div>

        <label className="mb-2 block font-medium">
          Account Holder
        </label>

        <input
          {...register("accountHolder")}
          className="w-full rounded-lg border p-3"
        />

      </div>

      {type === "upi" && (
        <>
          <div>

            <label className="mb-2 block font-medium">
              UPI ID
            </label>

            <input
              {...register("upiId")}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <div>
              <label className="mb-2 block font-medium">
                QR Code
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleQrUpload}
                disabled={uploadingQr}
                className="w-full rounded-lg border p-3"
              />

              {uploadingQr && (
                <p className="mt-2 text-sm text-neutral-500">
                  Uploading QR code...
                </p>
              )}

              {qrPreview && (
                <div className="mt-4">
                  <Image
                    src={qrPreview}
                    alt="QR Preview"
                    width={220}
                    height={220}
                    className="rounded-lg border object-contain"
                  />
                </div>
              )}
            </div>
            {/* <label className="mb-2 block font-medium">
              QR Image URL
            </label>

            <input
              {...register("qrImage")}
              className="w-full rounded-lg border p-3"
            /> */}

          </div>
        </>
      )}

      {type === "bank" && (
        <>
          <input
            {...register("bankName")}
            placeholder="Bank Name"
            className="w-full rounded-lg border p-3"
          />

          <input
            {...register("accountNumber")}
            placeholder="Account Number"
            className="w-full rounded-lg border p-3"
          />

          <input
            {...register("ifsc")}
            placeholder="IFSC"
            className="w-full rounded-lg border p-3"
          />

          <input
            {...register("branch")}
            placeholder="Branch"
            className="w-full rounded-lg border p-3"
          />
        </>
      )}

      {/* <button
        disabled={loading}
        className="rounded-xl bg-black px-6 py-3 text-white"
      >
        {loading
          ? "Saving..."
          : "Save Payment Account"}
      </button> */}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : submitLabel}
      </button>

    </form>
  );
}