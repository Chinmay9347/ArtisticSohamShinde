import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "@/firebase/storage";

export interface UploadedReference {
  fileName: string;
  url: string;
  size: number;
}

export async function uploadReferencePhotos(
  orderId: string,
  files: File[]
): Promise<UploadedReference[]> {
  const uploaded: UploadedReference[] = [];

  for (const file of files) {
    const storageRef = ref(
      storage,
      `orders/${orderId}/${Date.now()}-${file.name}`
    );

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    uploaded.push({
      fileName: file.name,
      url,
      size: file.size,
    });
  }

  return uploaded;
}