"use client";

import { startTransition, useActionState, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Wizardry from "@/components/ui/Wizardry";
import {
  FullPropertyFormValues,
  FullPropertySchema,
  STEP_FIELD_NAMES,
  PROPERTY_TABS,
} from "../../_schema/property.schema";
import { PropertyType } from "@/app/generated/prisma/enums";
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
import { getPropertyRedirectPath } from "@/lib/property-redirect";

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
      isPublished: false,
      isFeatured: false,
      status: "FOR_SALE",
      title: "",
      slug: "",
      description: "",
      type: PropertyType.CONDO,
      address: "",
      city: "",
      imageItems: [],
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

    // Extract files from imageItems before serialization
    const imageItemsForServer = data.imageItems.map((item) => ({
      id: item.id,
      caption: item.caption,
      order: item.order,
      isPrimary: item.isPrimary,
    }));
    formData.append("imageItems", JSON.stringify(imageItemsForServer));

    data.imageItems.forEach((item) => {
      if (item.file) {
        formData.append("imageFiles", item.file);
      }
    });

    // Extract floor-plan files from units before serialization
      const unitsForServer = data.units.map((unit) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { floorPlanImageFile, ...rest } = unit;
        return rest;
      });
    formData.append("units", JSON.stringify(unitsForServer));

    data.units.forEach((unit, index) => {
      if (unit.floorPlanImageFile) {
        formData.append(`floorPlanFiles_${index}`, unit.floorPlanImageFile);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageItems, units, ...rest } = data;

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
    getRedirectPath: getPropertyRedirectPath,
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
