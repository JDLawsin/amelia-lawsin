"use client";

import FormField from "./FormField";
import { Textarea } from "./shadcn/textarea";
import clsx from "clsx";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errors?: string[];
  hint?: string;
  containerClassName?: string;
}

const FormTextArea = ({
  id,
  name,
  label,
  errors,
  hint,
  required,
  className,
  containerClassName,
  ...props
}: Props) => {
  if (!id || !name) {
    throw new Error("FormTextarea requires both id and name");
  }

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      errors={errors}
      hint={hint}
      containerClassName={containerClassName}
    >
      <Textarea
        id={id}
        name={name}
        {...props}
        className={clsx(
          "rounded-xl bg-background min-h-25",
          "border border-input",
          "shadow-apple-sm",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "transition-all resize-none",
          errors?.length && "border-destructive focus-visible:ring-destructive",
          className,
        )}
      />
    </FormField>
  );
};

export default FormTextArea;
