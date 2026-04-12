"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Plus } from "lucide-react";
import clsx from "clsx";

type Props = {
  title: string;
  subtitle?: string | ReactNode;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

const PageHeader = ({
  title,
  subtitle,
  actionLabel = "New",
  actionHref,
  actionIcon = <Plus className="w-4 h-4" />,
  action,
  className = "",
}: Props) => {
  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <div>
        <h1 className="text-lg font-medium text-ink">{title}</h1>

        {subtitle && <p className="text-xs text-ash mt-0.5">{subtitle}</p>}
      </div>

      <div>
        {action ? (
          action
        ) : actionHref ? (
          <Link
            href={actionHref}
            className="flex items-center gap-2 h-9 px-4 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors"
          >
            {actionIcon}
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;
