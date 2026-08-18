import {
  ContactCTA,
  ContactFAQ,
  ContactForm,
  ContactHero,
  ContactInfo,
  ContactMap,
} from "@/components/features/contact";

import {
  businessHours as defaultBusinessHours,
  contactInfo as defaultContactInfo,
  socialLinks as defaultSocialLinks,
} from "@/data/contact";

import { getSiteContent } from "@/services/site-content.service";

type ContactDetailsContent = {
  phone?: string;
  email?: string;
  location?: string;
  workingHours?: string;

  businessHours?: {
    day: string;
    time: string;
  }[];

  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    youtube?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content =
    await getSiteContent<ContactDetailsContent>(
      "contactDetails",
      {},
    );

  const phone =
    content.phone ??
    defaultContactInfo.find(
      (item) => item.title === "Phone",
    )?.value ??
    "";

  const email =
    content.email ??
    defaultContactInfo.find(
      (item) => item.title === "Email",
    )?.value ??
    "";

  const location =
    content.location ??
    defaultContactInfo.find(
      (item) => item.title === "Location",
    )?.value ??
    "Pune, Maharashtra, India";

  const workingHours =
    content.workingHours ??
    defaultContactInfo.find(
      (item) => item.title === "Working Hours",
    )?.value ??
    "";

  const phoneHref =
    `tel:${phone.replace(/\D/g, "")}`;

  const emailHref =
    `mailto:${email}`;

  const contactInfo = defaultContactInfo.map(
    (item) => {
      if (item.title === "Phone") {
        return {
          ...item,
          value: phone,
          href: phoneHref,
        };
      }

      if (item.title === "Email") {
        return {
          ...item,
          value: email,
          href: emailHref,
        };
      }

      if (item.title === "Location") {
        return {
          ...item,
          value: location,
        };
      }

      if (item.title === "Working Hours") {
        return {
          ...item,
          value: workingHours,
        };
      }

      return item;
    },
  );

  const finalBusinessHours =
    content.businessHours ??
    defaultBusinessHours;

  const socialLinks =
    defaultSocialLinks.map((item) => {
      if (item.platform === "Instagram") {
        return {
          ...item,
          url:
            content.socialLinks?.instagram ??
            item.url,
        };
      }

      if (item.platform === "WhatsApp") {
        return {
          ...item,
          url:
            content.socialLinks?.whatsapp ??
            item.url,
        };
      }

      if (item.platform === "Facebook") {
        return {
          ...item,
          url:
            content.socialLinks?.facebook ??
            item.url,
        };
      }

      if (item.platform === "YouTube") {
        return {
          ...item,
          url:
            content.socialLinks?.youtube ??
            item.url,
        };
      }

      return item;
    });

  return (
    <>
      {/* UNCHANGED */}
      <ContactHero
        title="Contact"
        heading="Let's Create Something Beautiful"
        description="Have a question, want to commission a portrait, or discuss a custom artwork? I'd love to hear from you."
      />

      {/* ONLY CONTACT DETAILS ARE NOW DYNAMIC */}
      <ContactInfo
        contactInfo={contactInfo}
        businessHours={finalBusinessHours}
        socialLinks={socialLinks}
      />

      {/* UNCHANGED */}
      <ContactForm />

      {/* UNCHANGED */}
      <ContactMap
        address={location}
      />

      {/* UNCHANGED */}
      <ContactFAQ />

      {/* UNCHANGED */}
      <ContactCTA
        title="Ready to Preserve Your Memories?"
        description="Let's create a handcrafted portrait you'll cherish forever."
      />
    </>
  );
}

// import {
//   ContactCTA,
//   ContactFAQ,
//   ContactForm,
//   ContactHero,
//   ContactInfo,
//   ContactMap,
// } from "@/components/features/contact";

// import {
//   businessHours,
//   contactInfo,
//   socialLinks,
// } from "@/data/contact";

// export default function ContactPage() {
//   return (
//     <>
//       <ContactHero
//         title="Contact"
//         heading="Let's Create Something Beautiful"
//         description="Have a question, want to commission a portrait, or discuss a custom artwork? I'd love to hear from you."
//       />

//       <ContactInfo
//         contactInfo={contactInfo}
//         businessHours={businessHours}
//         socialLinks={socialLinks}
//       />

//       <ContactForm />

//       <ContactMap
//         address="Pune, Maharashtra, India"
//       />

//       <ContactFAQ />

//       <ContactCTA
//         title="Ready to Preserve Your Memories?"
//         description="Let's create a handcrafted portrait you'll cherish forever."
//       />
//     </>
//   );
// }