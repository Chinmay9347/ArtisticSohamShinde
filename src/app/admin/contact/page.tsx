"use client";

import { useEffect, useState } from "react";
import { Mail, Copy, Save, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getContactMessages,
  updateContactMessageStatus,
  type ContactMessage,
} from "@/services/contact.service";

import {
  getSiteContent,
  saveSiteContent,
} from "@/services/site-content.service";

type BusinessHour = {
  day: string;
  time: string;
};

type ContactDetails = {
  phone: string;
  email: string;
  location: string;
  workingHours: string;
  businessHours: BusinessHour[];
  socialLinks: {
    instagram: string;
    whatsapp: string;
    facebook: string;
    youtube: string;
  };
};

const DEFAULT_CONTACT_DETAILS: ContactDetails = {
  phone: "+91 XXXXX XXXXX",
  email: "artist@example.com",
  location: "Pune, Maharashtra, India",
  workingHours: "Mon - Sat • 10:00 AM - 8:00 PM",

  businessHours: [
    {
      day: "Monday - Friday",
      time: "10:00 AM - 8:00 PM",
    },
    {
      day: "Saturday",
      time: "10:00 AM - 6:00 PM",
    },
    {
      day: "Sunday",
      time: "By Appointment",
    },
  ],

  socialLinks: {
    instagram:
      "https://instagram.com/artistic_soham_shinde_",

    whatsapp:
      "https://wa.me/91XXXXXXXXXX",

    facebook: "#",

    youtube: "#",
  },
};

export default function AdminContactPage() {
  const router = useRouter();

  const [items, setItems] = useState<ContactMessage[]>([]);
  const [message, setMessage] = useState("");

  const [contactDetails, setContactDetails] =
    useState<ContactDetails>(DEFAULT_CONTACT_DETAILS);

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    void loadContactMessages();
    void loadContactDetails();
  }, []);

  async function loadContactMessages() {
    try {
      const data = await getContactMessages();
      setItems(data);
    } catch {
      setMessage("Unable to load contact messages.");
    }
  }

  async function loadContactDetails() {
    try {
      setLoadingDetails(true);

      const data = await getSiteContent<ContactDetails>(
        "contactDetails",
        DEFAULT_CONTACT_DETAILS,
      );

      setContactDetails({
        ...DEFAULT_CONTACT_DETAILS,
        ...data,

        businessHours:
          data.businessHours ??
          DEFAULT_CONTACT_DETAILS.businessHours,

        socialLinks: {
          ...DEFAULT_CONTACT_DETAILS.socialLinks,
          ...(data.socialLinks ?? {}),
        },
      });
    } catch {
      setSaveMessage(
        "Unable to load Contact Details. Showing default values.",
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  async function saveContactDetails() {
    try {
      setSavingDetails(true);
      setSaveMessage("");

      await saveSiteContent(
        "contactDetails",
        contactDetails,
      );

      setSaveMessage(
        "Contact Details saved successfully.",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Contact details save failed:",
        error,
      );

      setSaveMessage(
        "Unable to save Contact Details. Please try again.",
      );
    } finally {
      setSavingDetails(false);
    }
  }

  function resetContactDetails() {
    setContactDetails(
      structuredClone(DEFAULT_CONTACT_DETAILS),
    );

    setSaveMessage(
      "Default values restored. Click Save Changes to apply them.",
    );
  }

  function updateBusinessHour(
    index: number,
    field: keyof BusinessHour,
    value: string,
  ) {
    setContactDetails((current) => ({
      ...current,

      businessHours: current.businessHours.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item,
      ),
    }));
  }

  function updateSocialLink(
    platform: keyof ContactDetails["socialLinks"],
    value: string,
  ) {
    setContactDetails((current) => ({
      ...current,

      socialLinks: {
        ...current.socialLinks,
        [platform]: value,
      },
    }));
  }

  function reply(item: ContactMessage) {
    const body = `Hello ${item.name},

Thank you for contacting Artistic Soham Shinde.

Regarding: ${item.subject}

[Write your reply here]

Regards,
Artistic Soham Shinde`;

    void navigator.clipboard?.writeText(body);

    window.location.href =
      `mailto:${encodeURIComponent(item.email)}` +
      `?subject=${encodeURIComponent(
        `Re: ${item.subject}`,
      )}` +
      `&body=${encodeURIComponent(body)}`;

    void updateContactMessageStatus(
      item.id,
      "REPLIED",
    ).then(() => {
      router.refresh();

      setItems((old) =>
        old.map((x) =>
          x.id === item.id
            ? {
                ...x,
                status: "REPLIED",
              }
            : x,
        ),
      );
    });
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">

      {/* Page Header */}
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
          Administration
        </p>

        <h1 className="mt-2 font-cinzel text-4xl">
          Contact
        </h1>

        <p className="mt-3 max-w-3xl text-neutral-600">
          Manage public Contact Details and review
          customer contact messages.
        </p>
      </section>

      {/* ========================================================= */}
      {/* CONTACT DETAILS */}
      {/* ========================================================= */}

      <section className="rounded-3xl border bg-white p-7 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
              Website Content
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Contact Details
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              These values appear in the Contact Details
              section of the public website.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetContactDetails}
              disabled={savingDetails}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => void saveContactDetails()}
              disabled={
                savingDetails ||
                loadingDetails
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#b89220] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />

              {savingDetails
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            {saveMessage}
          </div>
        )}

        {loadingDetails ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
            Loading Contact Details...
          </div>
        ) : (
          <div className="mt-8 space-y-8">

            {/* Basic Contact Details */}
            <div>
              <h3 className="text-lg font-semibold">
                Contact Information
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-2">

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Phone
                  </span>

                  <input
                    value={contactDetails.phone}
                    onChange={(event) =>
                      setContactDetails((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Email
                  </span>

                  <input
                    value={contactDetails.email}
                    onChange={(event) =>
                      setContactDetails((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    type="email"
                    placeholder="artist@example.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Location
                  </span>

                  <input
                    value={contactDetails.location}
                    onChange={(event) =>
                      setContactDetails((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Pune, Maharashtra, India"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Working Hours
                  </span>

                  <input
                    value={
                      contactDetails.workingHours
                    }
                    onChange={(event) =>
                      setContactDetails((current) => ({
                        ...current,
                        workingHours:
                          event.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Mon - Sat • 10:00 AM - 8:00 PM"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-lg font-semibold">
                Business Hours
              </h3>

              <div className="mt-4 space-y-4">

                {contactDetails.businessHours.map(
                  (item, index) => (
                    <div
                      key={`${item.day}-${index}`}
                      className="grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-2"
                    >
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-neutral-800">
                          Day
                        </span>

                        <input
                          value={item.day}
                          onChange={(event) =>
                            updateBusinessHour(
                              index,
                              "day",
                              event.target.value,
                            )
                          }
                          type="text"
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-neutral-800">
                          Time
                        </span>

                        <input
                          value={item.time}
                          onChange={(event) =>
                            updateBusinessHour(
                              index,
                              "time",
                              event.target.value,
                            )
                          }
                          type="text"
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                        />
                      </label>
                    </div>
                  ),
                )}

              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold">
                Follow Artistic Soham
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-2">

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Instagram URL
                  </span>

                  <input
                    value={
                      contactDetails.socialLinks.instagram
                    }
                    onChange={(event) =>
                      updateSocialLink(
                        "instagram",
                        event.target.value,
                      )
                    }
                    type="url"
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    WhatsApp URL
                  </span>

                  <input
                    value={
                      contactDetails.socialLinks.whatsapp
                    }
                    onChange={(event) =>
                      updateSocialLink(
                        "whatsapp",
                        event.target.value,
                      )
                    }
                    type="url"
                    placeholder="https://wa.me/..."
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Facebook URL
                  </span>

                  <input
                    value={
                      contactDetails.socialLinks.facebook
                    }
                    onChange={(event) =>
                      updateSocialLink(
                        "facebook",
                        event.target.value,
                      )
                    }
                    type="url"
                    placeholder="https://facebook.com/..."
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    YouTube URL
                  </span>

                  <input
                    value={
                      contactDetails.socialLinks.youtube
                    }
                    onChange={(event) =>
                      updateSocialLink(
                        "youtube",
                        event.target.value,
                      )
                    }
                    type="url"
                    placeholder="https://youtube.com/..."
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  />
                </label>

              </div>
            </div>

          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* CONTACT MESSAGES */}
      {/* ========================================================= */}

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Customer Communication
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Contact Messages
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Review enquiries, copy the customer message
            and open your email client with a ready reply.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border bg-white p-4 text-sm">
            {message}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="divide-y">

            {items.length === 0 ? (
              <p className="p-8 text-neutral-500">
                No messages yet.
              </p>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div>
                      <h2 className="font-semibold">
                        {item.subject}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {item.name} · {item.email}

                        {item.phone
                          ? ` · ${item.phone}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          void navigator.clipboard?.writeText(
                            item.message,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
                      >
                        <Copy size={15} />
                        Copy Message
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          reply(item)
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#b89220]"
                      >
                        <Mail size={15} />
                        Reply by Email
                      </button>

                      <select
                        value={
                          item.status ?? "NEW"
                        }
                        onChange={(event) => {
                          const status =
                            event.target.value as ContactMessage["status"];

                          void updateContactMessageStatus(
                            item.id,
                            status,
                          ).then(() => {
                            setItems((old) =>
                              old.map((x) =>
                                x.id === item.id
                                  ? {
                                      ...x,
                                      status,
                                    }
                                  : x,
                              ),
                            );
                          });
                        }}
                        className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#C9A227]"
                      >
                        <option>NEW</option>
                        <option>READ</option>
                        <option>REPLIED</option>
                      </select>

                    </div>
                  </div>

                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                    {item.message}
                  </p>
                </article>
              ))
            )}

          </div>
        </section>
      </section>

    </main>
  );
}