import Link from "next/link";
import { Container } from "@/components/ui/Container";
// import { Typography } from "@/components/ui/Typography";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 py-12 md:flex-row">

          <div className="flex flex-col items-center text-center">
            <h3 className="text-3xl font-heading font-semibold">
              Artistic Soham Shinde
            </h3>

            <p className="mt-4 max-w-xl text-zinc-600">
              Turning Memories into Timeless Art.
            </p>
          </div>
          {/* <div>
            <Typography variant="h5">
              Artistic Soham Shinde
            </Typography>

            <Typography
              className="mt-2 text-zinc-600"
            >
              Turning Memories into Timeless Art.
            </Typography>
          </div> */}

          <nav className="flex gap-6 text-sm">

            <Link href="/">
              Home
            </Link>

            <Link href="/gallery">
              Gallery
            </Link>

            <Link href="/pricing">
              Pricing
            </Link>

            <Link href="/contact">
              Contact
            </Link>

          </nav>

        </div>

        <div className="border-t border-zinc-200 py-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center">

            <p className="text-sm text-zinc-500">
              {/* © 2026*/} Artistic Soham Shinde. 
              <br />
              .
            </p>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
                Powered by
              </p>

              <p className="mt-2 text-lg font-semibold tracking-wide text-[#C9A227]">
                Software.Hardware.Project.CK
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Created by <span className="font-medium text-zinc-800">Chinmay Kumbhar</span>
              </p>

            </div>

          </div>
        </div>
        
        {/* <div className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">

          © {new Date().getFullYear()} Artistic Soham Shinde.
          .

        </div> */}
      </Container>
    </footer>
  );
}