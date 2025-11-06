"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { navLinks } from "@/constants";
import ThemeToggler from "./theme-toggler";
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuLink
      asChild
      className={cn(
        navigationMenuTriggerStyle(),
        "bg-transparent text-sm font-medium",
        isActive
          ? "text-orange-600 underline underline-offset-4"
          : "text-gray-200 hover:text-orange-600"
      )}
    >
      <Link href={href}>{children}</Link>
    </NavigationMenuLink>
  );
};

export default function ProfessionalNavbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            LWF
          </Link>
        </div>
        <div className="hidden md:flex md:items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggler />
          {/* User Auth: Dropdown or Login Button */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-2"
                >
                  <img
                    src={
                      session.user.image ??
                      `https://avatar.vercel.sh/${session.user.name}.png`
                    }
                    alt={session.user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="hidden text-sm font-medium text-gray-700 lg:inline">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-gray-500 lg:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/orders")}>
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col sm:max-w-sm">
                <div className="mb-6">
                  <Link
                    href="/"
                    onClick={() => setSheetOpen(false)}
                    className="text-xl font-bold text-primary-600"
                  >
                    Giftora
                  </Link>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-1 flex-col space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className={cn(
                        "rounded-md p-2 text-base font-medium text-gray-700 hover:bg-gray-100",
                        pathname === link.href &&
                          "bg-primary-50 text-primary-600"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <Separator className="my-4" />

                {/* Mobile Auth Section */}
                <div className="flex flex-col space-y-2">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setSheetOpen(false)}
                        className="rounded-md p-2 font-medium text-gray-700 hover:bg-gray-100"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setSheetOpen(false)}
                        className="rounded-md p-2 font-medium text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleLogout();
                          setSheetOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login" onClick={() => setSheetOpen(false)}>
                          Log In
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link
                          href="/signup"
                          onClick={() => setSheetOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
