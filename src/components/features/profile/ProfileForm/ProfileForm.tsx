"use client";

import { useState } from "react";
import { AvatarUploader } from "../AvatarUploader";
import { uploadImage } from "@/services/cloudinary";
import { updateAvatar } from "@/services/user";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
//import { getUserProfile, updateUserProfile, } from "@/services/user";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateUserProfile } from "@/services/user";
import { toast } from "sonner";
import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";
import { ProfileFormData } from "./ProfileForm.types";

export function ProfileForm() {
  const { user } = useAuth();

  //const [loading, setLoading] = useState(true);
  const {
    profile,
    loading,
    refreshProfile,
  } = useUserProfile();

  const [uploadingAvatar, setUploadingAvatar] =
  useState(false);

  const [editedForm, setEditedForm] =
  useState<Partial<ProfileFormData>>({});

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8">
        Loading profile...
      </div>
    );
  }

  const form: ProfileFormData = {
    name: editedForm.name ?? profile?.name ?? "",
    email: editedForm.email ?? profile?.email ?? "",
    phone: editedForm.phone ?? profile?.phone ?? "",
    bio: editedForm.bio ?? profile?.bio ?? "",
    preferredContact:
        editedForm.preferredContact ??
        profile?.preferredContact ??
        "EMAIL",
  };

  const updateField = <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => {
    setEditedForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAvatarUpload = async (
    file: File
  ) => {
    if (!user) return;

    try {
      setUploadingAvatar(true);

      const result = await uploadImage(
        file,
        CLOUDINARY_FOLDERS.CUSTOMER_PROFILE
      );

      await updateAvatar(
        user.uid,
        result.secureUrl
      );

      await refreshProfile();

      setEditedForm({});

      toast.success("Profile updated successfully.");
    } catch {
      toast.error(
        "Unable to upload avatar."
      );
    } finally {
      setUploadingAvatar(false);
    }
  };
  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserProfile(
        user.uid,
        form
      );

      await refreshProfile();

      toast.success(
        "Profile updated successfully."
      );
    } catch {
      toast.error(
        "Unable to update profile."
      );
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 font-heading text-3xl font-semibold">
        My Profile
      </h2>

      <div className="mb-10 flex justify-center">
        <AvatarUploader
          image={profile?.avatar}
          uploading={uploadingAvatar}
          onSelect={handleAvatarUpload}
        />
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">

        {/* Name */}

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            value={form.email}
            disabled
            className="w-full rounded-xl border bg-zinc-100 p-3"
          />
        </div>

        {/* Phone */}

        <div>
          <label className="mb-2 block font-medium">
            Phone
          </label>

          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* Bio */}

        <div>
          <label className="mb-2 block font-medium">
            Bio
          </label>

          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <Button onClick={handleSave}>
          Save Changes
        </Button>
        

      </div>

    </section>
  );
}