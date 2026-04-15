"use client";

import clsx from "clsx";
import { Checkbox } from "./shadcn/checkbox";

interface Props {
  id: string;
  name: string;
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const FormCheckbox = ({
  id,
  name,
  label,
  hint,
  checked,
  onCheckedChange,
  className,
}: Props) => {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors",
        "bg-cloud border border-wire hover:border-ink/20",
        className,
      )}
    >
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(Boolean(v))}
        className="mt-0.5 shrink-0"
      />
      <div>
        <p className="text-xs font-medium text-ink leading-none mb-1">
          {label}
        </p>
        {hint && <p className="text-[10px] text-fog leading-relaxed">{hint}</p>}
      </div>
    </label>
  );
};

export default FormCheckbox;
