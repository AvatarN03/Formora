"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";

import { toast } from "@/components/ui/toast";

export default function PublicFormLinkActions({ shareURL }: { shareURL: string }) {
  const [copied, setCopied] = useState(false);
  const publicPath = `/f/${shareURL}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
      setCopied(true);
      toast.add({
        title: "Public link copied",
        description: "The published form link is ready to share.",
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.add({
        title: "Unable to copy link",
        description: "Open the public form and copy the URL manually.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5">
      <Link
        href={publicPath}
        target="_blank"
        rel="noreferrer"
        className="max-w-44 truncate px-1 text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        title="Open public form"
      >
        /f/{shareURL}
      </Link>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
        aria-label={copied ? "Public link copied" : "Copy public form link"}
        title={copied ? "Copied" : "Copy public form link"}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      <Link
        href={publicPath}
        target="_blank"
        rel="noreferrer"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
        aria-label="Visit public form"
        title="Visit public form"
      >
        <ExternalLink className="size-3.5" />
      </Link>
    </div>
  );
}
