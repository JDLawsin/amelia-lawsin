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
  Path,
} from "react-hook-form";
import { Spinner } from "./shadcn/spinner";
import { ScrollArea, ScrollBar } from "./shadcn/scroll-area";

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

const hasError = (error: unknown): boolean => {
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

    return await trigger(fields as Path<TFormValues>[]);
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
      <ScrollArea className="w-full mb-6 overflow-y-hidden">
        <TabsList
          className={clsx(
            "flex h-12 min-w-full items-center bg-cloud border border-wire rounded-2xl shadow-apple-sm",
            "p-0 overflow-x-auto overflow-y-hidden scrollbar-hide",
          )}
        >
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={tab}
              value={tab}
              type="button"
              className={clsx(
                "relative shrink-0 h-11 px-7 mx-px first:ml-1.5 last:mr-1.5",
                "text-xs font-medium capitalize whitespace-nowrap transition-all duration-200",
                "text-ash hover:text-ink",
                "data-[state=active]:bg-white data-[state=active]:text-ink",
                "data-[state=active]:shadow-apple-sm",
                "rounded-xl border border-transparent data-[state=active]:border-wire/30",
              )}
            >
              {tab}

              {index < currentIndex && tabsWithErrors[tab] && (
                <span
                  title="This step has errors"
                  className="absolute top-2 right-3 w-2 h-2 bg-destructive rounded-full ring-2 ring-white shadow-sm"
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollBar
          orientation="horizontal"
          className="h-1 mt-2 bg-wire/30 rounded-full"
        />
      </ScrollArea>

      {tabs.map((tab, index) => (
        <TabsContent key={tab} value={tab} className="mt-0">
          {childrenArray[index]}
        </TabsContent>
      ))}

      <div className="flex items-center justify-between pt-6 mt-2 border-t border-wire">
        <Button
          type="button"
          variant="ghost"
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="text-ash hover:bg-cloud transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" />
          Previous
        </Button>

        {isLastStep ? (
          <Button
            key="wizard-submit"
            type="submit"
            disabled={isPending}
            className="bg-ink hover:bg-ink/90 shadow-apple transition-all active:scale-[0.97]"
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
            className="bg-ink hover:bg-ink/90 shadow-apple transition-all active:scale-[0.97]"
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
