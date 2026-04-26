"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm, UseFormWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Wizardry from "@/components/ui/Wizardry";
import {
  FullPropertyFormValues,
  FullPropertySchema,
  STEP_FIELD_NAMES,
  PROPERTY_TABS,
} from "../../_schema/property.schema";
import { createPropertyAction, FormState } from "@/actions/property.action";
import BasicStep from "@/components/step/BasicStep";
import LocationStep from "@/components/step/LocationStep";
import SpecStep from "@/components/step/SpecStep";
import FeatureStep from "@/components/step/FeatureStep";
import DeveloperStep from "@/components/step/DeveloperStep";
import MediaStep from "@/components/step/MediaStep";
import UnitStep from "@/components/step/UnitStep";
import AmenityStep from "@/components/step/AmenityStep";
import PaymentSchemeStep from "@/components/step/PaymentSchemeStep";
import LandmarkStep from "@/components/step/LandmarkStep";
import { useFormActionEffect } from "@/hooks/useFormActionEffect";
import { useAutoSlug } from "@/hooks/useAutoSlug";

const CreatePropertyContainer = () => {
  const [currentStep, setCurrentStep] = useState(PROPERTY_TABS[0]);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createPropertyAction,
    null,
  );

  const form = useForm<FullPropertyFormValues>({
    resolver: zodResolver(
      FullPropertySchema,
    ) as Resolver<FullPropertyFormValues>,
    defaultValues: {
      listingType: "BRAND_NEW",
      isFeatured: false,
      status: "FOR_SALE",
      title: "",
      slug: "",
      description: "",
      type: "",
      address: "",
      city: "",
      images: [],
    },
    mode: "onTouched",
  });

  const {
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors: rhfErrors },
  } = form;

  useAutoSlug(watch, setValue, "title", "slug");

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    if (data.images && data.images.length > 0) {
      data.images.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    const { images, ...rest } = data;

    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const isArrayOrObject = typeof value === "object";
      if (isArrayOrObject) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  });

  useFormActionEffect(state, {
    getRedirectPath: (state) =>
      state?.slug ? `/properties/${state.slug}` : null,
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white border border-wire rounded-2xl p-6">
        <Wizardry<FullPropertyFormValues>
          tabs={PROPERTY_TABS}
          value={currentStep}
          onValueChange={(val) =>
            setCurrentStep(val as keyof typeof STEP_FIELD_NAMES)
          }
          stepFieldNames={STEP_FIELD_NAMES}
          control={control}
          errors={rhfErrors}
          trigger={trigger}
          isPending={isPending}
          submitLabel="Create Property"
        >
          <BasicStep control={control} />
          <LocationStep control={control} />
          <SpecStep control={control} />
          <FeatureStep control={control} />
          <DeveloperStep control={control} />
          <UnitStep control={control} />
          <AmenityStep control={control} />
          <PaymentSchemeStep control={control} />
          <LandmarkStep control={control} />
          <MediaStep control={control} />
        </Wizardry>
      </div>
    </form>
  );
};

export default CreatePropertyContainer;
