"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Gem, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Icons } from "./Icons";
import Image from "next/image";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface MobileNavProps {
  isAuth: boolean;
  email: string | undefined;
  imageUrl: string;
  name: string;
  subscriptionType: string;
}
const MobileNav = ({
  isAuth,
  email,
  imageUrl,
  name,
  subscriptionType,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (href === pathname) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen && (
        <div
          className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full"
          onClick={toggleOpen}
        >
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-up")}
                    className="flex items-center w-full font-semibold text-primary"
                    href="/sign-up"
                  >
                    Sign up <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300"></li>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-in")}
                    className="flex items-center w-full font-semibold"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300"></li>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <div className="flex gap-4">
                    <Avatar className="relative w-10 h-10">
                      {imageUrl ? (
                        <div className="relative aspect-square h-full w-full">
                          <Image
                            fill
                            sizes="32px"
                            src={imageUrl}
                            alt="profile picture"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <AvatarFallback>
                          <span className="sr-only">{name}</span>
                          <Icons.user className="h-6 w-6 text-zinc-900" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 leading-none">
                      {name && (
                        <p className="font-medium text-sm text-black">{name}</p>
                      )}
                      {email && (
                        <p className="w-[200px] truncate text-sm text-zinc-700">
                          {email}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
                <li className="my-3 h-px w-full bg-gray-300"></li>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300"></li>
                {subscriptionType === "pro" ? (
                  <li>
                    <Link href="/dashboard/billing">Manage Subscription</Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/pricing">
                      Upgrade <Gem className="text-primary h-4 w-4 ml-1.5" />
                    </Link>
                  </li>
                )}
                <li className="my-3 h-px w-full bg-gray-300"></li>
                <li>
                  <LogoutLink>Log out</LogoutLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
export default MobileNav;
