import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react/";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";
import Image from "next/image";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user: KindeUser | null = await getUser();
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-bold text-2xl text-black">
            TL
            <Image
              src="/tldr-logo.png"
              alt=""
              width={19}
              height={19}
              quality={100}
              className="mx-1 self-center"
            />
            DR
          </Link>

          <MobileNav
            isAuth={!!user}
            name={
              !user?.given_name || !user?.family_name
                ? "Your Account"
                : `${user.given_name} ${user.family_name}`
            }
            email={user?.email ?? ""}
            imageUrl={user?.picture ?? ""}
            subscriptionType={subscriptionPlan.isSubscribed ? "pro" : "free"}
          />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Sign up <ArrowRight className="ml-1.5 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default Navbar;
