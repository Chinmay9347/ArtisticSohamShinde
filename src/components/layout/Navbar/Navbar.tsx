"use client";

import { BRAND_LOGO_URL } from "@/constants/brand-assets";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { logoutUser } from "@/services/auth/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
// import { NAVIGATION } from "@/constants/navigation";
import { NAVIGATION } from "@/constants/navigation";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  // useEffect(() => {
  //   function handleClickOutside(
  //     event: MouseEvent
  //   ) {
  //     if (
  //       userMenuRef.current &&
  //       !userMenuRef.current.contains(
  //         event.target as Node
  //       )
  //     ) {
  //       setUserMenuOpen(false);
  //     }
  //   }

  //   document.addEventListener(
  //     "mousedown",
  //     handleClickOutside
  //   );

  //   return () =>
  //     document.removeEventListener(
  //       "mousedown",
  //       handleClickOutside
  //     );
  // }, []);
  // const [userMenuOpen, setUserMenuOpen] =
  //   useState(false);

  // const userMenuRef =
  //   useRef<HTMLDivElement>(null);
  const handleLogout = async () => {
    try {
      await logoutUser();

      toast.success("Logged out successfully.");

      router.push("/");
    } catch {
      toast.error("Unable to logout.");
    }
  };
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef =
    useRef<HTMLDivElement>(null);

  const mobileMenuButtonRef =
    useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   if (!mobileMenuOpen) return;
  //   const onPointerDown = (event: PointerEvent) => {
  //     const target = event.target as Node;
  //     if (mobileMenuRef.current?.contains(target)) return;
  //     setMobileMenuOpen(false);
  //   };
  //   const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileMenuOpen(false); };
  //   document.addEventListener("pointerdown", onPointerDown, true);
  //   document.addEventListener("keydown", onKeyDown);
  //   return () => { document.removeEventListener("pointerdown", onPointerDown, true); document.removeEventListener("keydown", onKeyDown); };
  // }, [mobileMenuOpen]);
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedInsideMenu =
        mobileMenuRef.current?.contains(target);

      const clickedMenuButton =
        mobileMenuButtonRef.current?.contains(target);

      if (
        clickedInsideMenu ||
        clickedMenuButton
      ) {
        return;
      }

      setMobileMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      onPointerDown,
      true,
    );

    document.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        onPointerDown,
        true,
      );

      document.removeEventListener(
        "keydown",
        onKeyDown,
      );
    };
  }, [mobileMenuOpen]);
  
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-4"
          >
            {/* <Image
              src={BRAND_LOGO_URL}
              alt="Artistic Soham Shinde"
              // width={60}
              // height={60}
              // 
              width={48}
              height={48}
              priority
              className="h-12 w-auto rounded-full"//"rounded-full"
            /> */}
            <Image
              src={BRAND_LOGO_URL}
              width={80}
              height={80}
              className="h-10 w-auto"
              alt="Artistic Soham"
            />
            {/* <Image
              src={BRAND_LOGO_URL}
              alt="Artistic Soham"
              width={180}
              height={60}
              className="w-40 h-auto"
            /> */}

            <div>
              <h2 className="font-heading text-lg font-semibold tracking-wide">
                Artistic Soham
              </h2>

              <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A227]">
                Pencil Portrait Artist
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-12 lg:flex">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-800 transition-all duration-300 hover:text-[#C9A227]"  
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}

          <div className="hidden items-center gap-3 lg:flex">
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="outline" size="md" className="h-[55px]"><LogIn size={14} /> Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="md" className="h-[50px]">Create Account</Button>
                </Link>

              </>
            ) : (
              <UserMenu
                user={user}
                onLogout={handleLogout}
                notificationCount={0}
              />
            )}
            </div>
            {/*  <UserMenu
                user={user}
                onLogout={handleLogout}
                notificationCount={0}
              />
            )}
          </div>
           <div className="hidden lg:block">
            <Link href={NAVBAR_CTA.href}>
              <Button size="md">
                {NAVBAR_CTA.label}
              </Button>
            </Link>
             <Link href="/commission">
              <Button size="md">
                Commission a Portrait
              </Button>
            </Link> 
          </div> 

          {/* Mobile Menu Button */}

          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="rounded-lg p-2 transition hover:bg-zinc-100 lg:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close Menu"
                : "Open Menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={28} />
          </button>

        </div>
      </Container>
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          className="border-t border-zinc-200 bg-white lg:hidden"
        >
          <Container>
            <nav className="flex flex-col py-4">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="rounded-md px-4 py-3 hover:bg-zinc-100"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-4 border-t pt-4">
                {!user ? (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Create Account</Button></Link>

                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href={profile?.role === "ADMIN" ? "/admin" : profile?.role === "ARTIST" ? "/artist" : "/dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full">
                        Dashboard
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                  // <div className="flex flex-col gap-3">
                  //   <Link href={profile?.role === "ADMIN" ? "/admin" : profile?.role === "ARTIST" ? "/artist" : "/dashboard"}>
                  //     <Button className="w-full">
                  //       Dashboard
                  //     </Button>
                  //   </Link>

                  //   <Button
                  //     variant="outline"
                  //     className="w-full"
                  //     onClick={handleLogout}
                  //   >
                  //     Logout
                  //   </Button>
                  // </div>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}


//11/07/2026
// "use client";

// import Link from "next/link";
// import { Menu } from "lucide-react";

// import { NAVIGATION } from "@/constants/navigation";

// import { Button } from "@/components/ui/button";

// export function Navbar() {
//   return (
//     <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-lg">
//       <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

//         {/* Logo */}

//         <Link
//           href="/"
//           className="flex items-center gap-3"
//         >
//           <span className="text-3xl font-bold">
//             AS
//           </span>

//           <div>
//             <p className="font-heading text-lg">
//               Artistic Soham
//             </p>

//             <p className="text-xs tracking-[0.3em] text-[#C9A227] uppercase">
//               Portrait Studio
//             </p>
//           </div>
//         </Link>

//         {/* Desktop Navigation */}

//         <nav className="hidden items-center gap-8 lg:flex">

//           {NAVIGATION.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="transition hover:text-[#C9A227]"
//             >
//               {item.label}
//             </Link>
//           ))}

//         </nav>

//         {/* CTA */}

//         <div className="hidden lg:block">
//           <Link href="/commission">
//             <Button>
//               Commission
//             </Button>
//           </Link>
//         </div>

//         {/* Mobile */}

//         <button className="lg:hidden">
//           <Menu size={28} />
//         </button>

//       </div>
//     </header>
//   );
// }