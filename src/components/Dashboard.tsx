"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { trpc } from "@/app/_trpc/client";
import { Button } from "./ui/button";
import UploadButton from "./UploadButton";
import Skeleton from "react-loading-skeleton";
import { Ghost, Loader2, MessageSquare, Plus, TrashIcon } from "lucide-react";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const Dashboard = ({ subscriptionPlan }: PageProps) => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const utils = trpc.useContext();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setDeletingFile(id);
    },
    onSettled() {
      setDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10 p-5">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0 border-b border-gray-200">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </div>

      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg-grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div
                      aria-hidden
                      className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                    ></div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-900">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {file._count.messages}
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteFile({ id: file.id })}
                  >
                    {deletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">No files are available yet.</h3>
          <p>Upload your first PDF!</p>
        </div>
      )}
    </main>
  );
};
export default Dashboard;
