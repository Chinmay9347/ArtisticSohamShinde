import type { CloudinaryUploadResult } from "./cloudinary.types";
import { auth } from "@/firebase/auth";

export async function uploadImage(
  file: File,
  folder: string,
): Promise<CloudinaryUploadResult> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Please sign in before uploading an image.",
    );
  }

  const idToken =
    await currentUser.getIdToken();

  const signatureResponse =
    await fetch(
      "/api/cloudinary/signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          folder,
        }),
      },
    );

  const signatureResult =
    await signatureResponse.json();

  if (!signatureResponse.ok) {
    throw new Error(
      signatureResult.message ??
        "Unable to authorize image upload.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "api_key",
    signatureResult.apiKey,
  );
  formData.append(
    "timestamp",
    String(signatureResult.timestamp),
  );
  formData.append(
    "signature",
    signatureResult.signature,
  );
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureResult.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "Cloudinary Error:",
      errorText,
    );

    throw new Error(
      `Cloudinary upload failed (${response.status}).`,
    );
  }

  const data =
    await response.json();

  return {
    assetId: data.asset_id,
    publicId: data.public_id,
    version: data.version,
    width: data.width,
    height: data.height,
    format: data.format,
    resourceType: data.resource_type,
    bytes: data.bytes,
    secureUrl: data.secure_url,
    originalFilename:
      data.original_filename,
    folder: data.folder,
  };
}
