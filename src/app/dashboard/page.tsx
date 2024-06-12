import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user: KindeUser | null = await getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  if (user) {
    return <div>{user.email}</div>;
  }
};

export default Page;
