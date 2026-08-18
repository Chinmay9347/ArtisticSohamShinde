//12/07/2026  0.1V
import { Hero } from "@/components/features/home/Hero";
import { FeaturedGallery } from "@/components/features/home/FeaturedGallery";
import { CommissionProcess } from "@/components/features/home/CommissionProcess";
import { WhyChooseMe } from "@/components/features/home/WhyChooseMe";
import { Testimonials } from "@/components/features/home/Testimonials";
import { FAQ } from "@/components/features/home/FAQ";
import { FinalCTA } from "@/components/features/home/FinalCTA";
import { ActiveOffers } from "@/components/features/home/ActiveOffers";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGallery />
      <CommissionProcess />
      <WhyChooseMe />
      <Testimonials />
      <FAQ />
      <ActiveOffers />
      <FinalCTA />
    </>
  );
}

//12/07/2026  0.0V
// import { Hero } from "@/components/features/home/Hero";
// import { FeaturedGallery } from "@/components/features/home/FeaturedGallery";
// import { CommissionProcess } from "@/components/features/home/CommissionProcess";

// export default function HomePage() {
//   return (
//     <>
//       <Hero />
//       <FeaturedGallery />
//       <CommissionProcess />
//     </>
//   );
// }


//11/07/2026  0.6V
// import { Hero } from "@/components/features/home/Hero";
// import { FeaturedGallery } from "@/components/features/home/FeaturedGallery";

// export default function HomePage() {
//   return (
//     <>
//       <Hero />
//       <FeaturedGallery />
//     </>
//   );
// }

//11/07/2026  0.5V
// import { Hero } from "@/components/features/home/Hero";

// export default function HomePage() {
//   return <Hero />;
// }

//11/07/2026  0.4V
// import { Navbar } from "@/components/layout/Navbar";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/Card";
// import { Container } from "@/components/ui/Container";
// import { Heading } from "@/components/ui/Heading";
// import { Section } from "@/components/ui/Section";
// import { Typography } from "@/components/ui/Typography";

// export default function HomePage() {
//   return (
//     <>
//       <Section className="min-h-[90vh] flex items-center">
//         <Container>
//           <Typography
//             variant="caption"
//             className="uppercase tracking-[0.35em] text-[#C9A227]"
//           >
//             Premium Pencil Portrait Artist
//           </Typography>

//           <Heading
//             level={1}
//             className="mt-6 max-w-4xl"
//           >
//             Artistic Soham Shinde
//           </Heading>

//           <Typography
//             variant="bodyLarge"
//             className="mt-8 max-w-2xl text-zinc-600"
//           >
//             Turning Memories into Timeless Art through handcrafted
//             hyper-realistic pencil portraits.
//           </Typography>

//           <div className="mt-12 flex gap-4">
//             <Button size="lg">
//               Commission a Portrait
//             </Button>

//             <Button
//               variant="outline"
//               size="lg"
//             >
//               View Gallery
//             </Button>
//           </div>
//         </Container>
//       </Section>

//       <Section>
//         <Container>

//           <Heading level={2}>
//             Featured Portraits
//           </Heading>

//           <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

//             <Card className="p-6">

//               <div className="aspect-[4/5] rounded-xl bg-zinc-200"></div>

//               <Heading
//                 level={4}
//                 className="mt-6"
//               >
//                 Couple Portrait
//               </Heading>

//               <Typography
//                 className="mt-2 text-zinc-600"
//               >
//                 Handmade graphite portrait on premium paper.
//               </Typography>

//             </Card>

//             <Card className="p-6">

//               <div className="aspect-[4/5] rounded-xl bg-zinc-200"></div>

//               <Heading
//                 level={4}
//                 className="mt-6"
//               >
//                 Family Portrait
//               </Heading>

//               <Typography
//                 className="mt-2 text-zinc-600"
//               >
//                 Custom multi-person portrait.
//               </Typography>

//             </Card>

//             <Card className="p-6">

//               <div className="aspect-[4/5] rounded-xl bg-zinc-200"></div>

//               <Heading
//                 level={4}
//                 className="mt-6"
//               >
//                 Pet Portrait
//               </Heading>

//               <Typography
//                 className="mt-2 text-zinc-600"
//               >
//                 Hyper-realistic pet commission.
//               </Typography>

//             </Card>

//           </div>

//         </Container>
//       </Section>
//     </>
//   );
// }

//11/07/2026  0.3V
// import { Container } from "@/components/ui/Container";
// import { Section } from "@/components/ui/Section";
// import { Heading } from "@/components/ui/Heading";
// import { Typography } from "@/components/ui/Typography";
// import { Button } from "@/components/ui/Button";

// export default function HomePage() {
//   return (
//     <Section className="min-h-[90vh] flex items-center">
//       <Container>
//         <Typography
//           variant="caption"
//           className="uppercase tracking-[0.3em] text-[#C9A227]"
//         >
//           Premium Pencil Portrait Artist
//         </Typography>

//         <Heading
//           level={1}
//           className="mt-6 max-w-4xl"
//         >
//           Artistic Soham Shinde
//         </Heading>

//         <Typography
//           variant="bodyLarge"
//           className="mt-8 max-w-2xl text-zinc-600"
//         >
//           Turning Memories into Timeless Art through
//           handcrafted hyper-realistic pencil portraits that
//           preserve life's most meaningful moments.
//         </Typography>

//         <div className="mt-12 flex flex-wrap gap-4">
//           <Button size="lg">
//             Commission a Portrait
//           </Button>

//           <Button
//             variant="outline"
//             size="lg"
//           >
//             View Gallery
//           </Button>
//         </div>
//       </Container>
//     </Section>
//   );
// }

//11/07/2026  0.2V
// import { Container } from "@/components/ui/Container";
// import { Section } from "@/components/ui/Section";
// import { Heading } from "@/components/ui/Heading";
// import { Typography } from "@/components/ui/Typography";

// export default function HomePage() {
//   return (
//     <Section>
//       <Container>
//         <Heading level={1}>
//           Artistic Soham Shinde
//         </Heading>

//         <Typography
//           variant="bodyLarge"
//           className="mt-8 max-w-xl"
//         >
//           Turning Memories into Timeless Art through
//           handcrafted pencil portraits.
//         </Typography>
//       </Container>
//     </Section>
//   );
// }

//11/07/2026  0.1V
// import { Container } from "@/components/ui/Container";
// import { Section } from "@/components/ui/Section";
// import { Typography } from "@/components/ui/Typography";

// export default function HomePage() {
//   return (
//     <Section>
//       <Container>
//         <Typography variant="display">
//           Artistic Soham Shinde
//         </Typography>

//         <Typography
//           variant="bodyLarge"
//           className="mt-6 max-w-2xl"
//         >
//           Turning Memories into Timeless Art through
//           handcrafted pencil portraits.
//         </Typography>
//       </Container>
//     </Section>
//   );
// }

//11/07/2026  0.0V
// import { Typography } from "@/components/ui/Typography";

// export default function HomePage() {
//   return (
//     <main className="p-12 space-y-6">
//       <Typography variant="display">
//         Artistic Soham Shinde
//       </Typography>

//       <Typography variant="h2">
//         Turning Memories into Timeless Art.
//       </Typography>

//       <Typography variant="bodyLarge">
//         Hyper-realistic pencil portraits crafted with precision,
//         emotion, and attention to every detail.
//       </Typography>

//       <Typography variant="caption">
//         Design System Preview
//       </Typography>
//     </main>
//   );
// }

//10/07/26
// export default function HomePage() {
//   return (
//     <main className="container-custom section">
//       <div className="text-center">
//         <p className="gold-text text-lg font-semibold">
//           Welcome to
//         </p>

//         <h1 className="mt-4 text-6xl font-bold">
//           Artistic Soham Shinde
//         </h1>

//         <p className="mt-6 text-xl text-gray-600">
//           Turning Memories into Timeless Art.
//         </p>

//         <div className="mt-10 flex justify-center gap-4">
//           <button className="rounded-xl bg-black px-8 py-4 text-white transition hover:opacity-90">
//             Commission a Portrait
//           </button>

//           <button className="rounded-xl border border-black px-8 py-4 transition hover:bg-black hover:text-white">
//             View Gallery
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
