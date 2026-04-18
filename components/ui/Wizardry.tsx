"use client";

import { Children, ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { Button } from "@/components/ui/shadcn/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import {
  Control,
  UseFormTrigger,
  FieldValues,
  FieldErrors,
} from "react-hook-form";
import { Spinner } from "./shadcn/spinner";

type Props<TFormValues extends FieldValues> = {
  tabs: string[];
  value: string;
  onValueChange: (value: string) => void;
  stepFieldNames: Record<string, readonly (keyof TFormValues)[]>;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  trigger: UseFormTrigger<TFormValues>;
  isPending?: boolean;
  submitLabel?: string;
  children: ReactNode;
};

const hasError = (error: any): boolean => {
  if (!error) return false;

  if (Array.isArray(error)) return error.some(hasError);

  if (typeof error === "object") {
    if ("message" in error) return true;
    return Object.values(error).some(hasError);
  }

  return false;
};

const Wizardry = <TFormValues extends FieldValues>({
  tabs,
  value,
  onValueChange,
  stepFieldNames,
  errors,
  trigger,
  isPending = false,
  submitLabel = "Create listing",
  children,
}: Props<TFormValues>) => {
  const currentIndex = tabs.indexOf(value);
  const childrenArray = Children.toArray(children);
  const isLastStep = currentIndex === tabs.length - 1;
  const isFirstStep = currentIndex === 0;

  const validateCurrentStep = async (): Promise<boolean> => {
    const fields = stepFieldNames[value];
    if (!fields?.length) return true;

    return await trigger(fields as any);
  };

  const handleNext = async () => {
    if (!(await validateCurrentStep())) return;
    if (currentIndex < tabs.length - 1) {
      onValueChange(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onValueChange(tabs[currentIndex - 1]);
    }
  };

  const tabsWithErrors = tabs.reduce<Record<string, boolean>>((acc, tab) => {
    const fields = stepFieldNames[tab];

    acc[tab] = fields ? fields.some((field) => hasError(errors[field])) : false;

    return acc;
  }, {});

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full h-auto p-0 bg-cloud border border-wire rounded-xl overflow-hidden mb-4">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab}
            value={tab}
            type="button"
            className={clsx(
              "flex-1 relative capitalize rounded-none border-r border-wire last:border-r-0 text-xs",
              "data-[state=active]:bg-white data-[state=active]:text-ink",
              "text-ash hover:text-ink",
            )}
          >
            {tab}

            {index < currentIndex && tabsWithErrors[tab] && (
              <span
                title="This step has errors"
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full"
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab, index) => (
        <TabsContent key={tab} value={tab} className="mt-0">
          {childrenArray[index]}
        </TabsContent>
      ))}

      <div className="flex items-center justify-between pt-5 mt-2 border-t border-wire">
        <Button
          type="button"
          variant="ghost"
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="text-ash"
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" />
          Previous
        </Button>

        {isLastStep ? (
          <Button
            key="wizard-submit"
            type="submit"
            disabled={isPending}
            className="bg-ink hover:bg-ink/90"
          >
            {isPending ? (
              <>
                <Spinner className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        ) : (
          <Button
            key="wizard-next"
            type="button"
            onClick={handleNext}
            className="bg-ink hover:bg-ink/90"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>
    </Tabs>
  );
};

export default Wizardry;
