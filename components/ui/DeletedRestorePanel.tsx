"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "react-hot-toast";

type Props = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeClassName: string;
  description: string;
  backHref: string;
  backLabel: string;
  onRestore: () => Promise<{ success: boolean; message: string }>;
};

const DeletedRestorePanel = ({
  title,
  subtitle,
  badgeLabel,
  badgeClassName,
  description,
  backHref,
  backLabel,
  onRestore,
}: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleRestore = () => {
    startTransition(async () => {
      const result = await onRestore();

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={
          <>
            <span className="truncate">{title}</span>
            <Badge className={badgeClassName}>{badgeLabel}</Badge>
          </>
        }
        subtitle={subtitle}
      />

      <div className="bg-white border border-wire rounded-2xl p-8 max-w-lg">
        <h2 className="text-base font-medium text-ink">This item is in trash</h2>
        <p className="text-sm text-ash mt-2">{description}</p>

        <div className="flex flex-wrap items-center gap-2 mt-6">
          <Button onClick={handleRestore} disabled={pending}>
            {pending ? "Restoring…" : "Restore"}
          </Button>
          <Button variant="ghost" asChild>
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletedRestorePanel;
