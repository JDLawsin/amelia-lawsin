// components/ui/FormField.tsx
"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  id: string;
  label?: string;
  required?: boolean;
  errors?: string[];
  hint?: string;
  containerClassName?: string;
  children: ReactNode;
};

const FormField = ({
  id,
  label,
  required,
  errors,
  hint,
  containerClassName,
  children,
}: Props) => (
  <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
    {label && (
      <label
        htmlFor={id}
        className="text-xs font-medium text-ink flex items-center justify-between"
      >
        <span>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </span>
      </label>
    )}

    {children}

    {errors?.length ? (
      <p id={`${id}-error`} className="text-xs text-destructive">
        {errors[0]}
      </p>
    ) : hint ? (
      <p className="text-xs text-fog">{hint}</p>
    ) : null}
  </div>
);

export default FormField;
