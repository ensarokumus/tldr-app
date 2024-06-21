"use client";

import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  RotateCw,
  Search,
} from "lucide-react";
import { useResizeDetector } from "react-resize-detector";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import PdfFullscreen from "./PdfFullscreen";
import SimpleBar from "simplebar-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setPageNumber(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={pageNumber <= 1}
            onClick={() => {
              setPageNumber((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(pageNumber - 1));
            }}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8 focus-visible:ring-blue-500",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "?"}</span>
            </p>
          </div>

          <Button
            disabled={pageNumber === undefined || pageNumber === numPages}
            onClick={() => {
              setPageNumber((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
              setValue("page", String(pageNumber + 1));
            }}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2" aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4" />
                {scale * 100}%<ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            aria-label="rotate clockwise"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setRotation((prev) => prev - 90)}
            variant="ghost"
            aria-label="rotate counter-clockwise"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <PdfFullscreen fileUrl={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading pdf",
                  description: "Please try again",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className="max-h-full"
            >
              <div
                className={
                  scale < 1
                    ? "bg-zinc-700 flex justify-center items-center"
                    : ""
                }
              >
                {isLoading && renderedScale ? (
                  <Page
                    width={width ? width : 1}
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    key={"@" + renderedScale}
                  />
                ) : null}

                <Page
                  className={cn(isLoading ? "hidden" : "")}
                  width={width ? width : 1}
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + scale}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
              </div>
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
export default PdfRenderer;
