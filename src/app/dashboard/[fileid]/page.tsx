import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileid: string;
  };
}

const page = async ({ params }: PageProps) => {
  // get file id
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user: KindeUser | null = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`);

  // get the file from db
  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side of the pdf view page */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        {/* right side of the pdf view page */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
};
export default page;
