"use client";

import { startTransition, useActionState, useState } from "react";
import {
  FullPropertyFormValues,
  FullPropertySchema,
  PROPERTY_TABS,
  STEP_FIELD_NAMES,
} from "../../../_schema/property.schema";
import { FormState, updatePropertyAction } from "@/actions/property.action";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormActionEffect } from "@/hooks/useFormActionEffect";
import Wizardry from "@/components/ui/Wizardry";
import BasicStep from "@/components/step/BasicStep";
import LocationStep from "@/components/step/LocationStep";
import SpecStep from "@/components/step/SpecStep";
import FeatureStep from "@/components/step/FeatureStep";
import DeveloperStep from "@/components/step/DeveloperStep";
import UnitStep from "@/components/step/UnitStep";
import AmenityStep from "@/components/step/AmenityStep";
import PaymentSchemeStep from "@/components/step/PaymentSchemeStep";
import LandmarkStep from "@/components/step/LandmarkStep";
import MediaStep from "@/components/step/MediaStep";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import { mapPropertyToForm } from "@/lib/mapper";
import { PropertyAdminDetail } from "@/services/property.admin.service";

type Props = {
  property: PropertyAdminDetail;
};

const UpdatePropertyContainer = ({ property }: Props) => {
  const [currentStep, setCurrentStep] = useState(PROPERTY_TABS[0]);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updatePropertyAction,
    null,
  );

  const form = useForm<FullPropertyFormValues>({
    resolver: zodResolver(
      FullPropertySchema,
    ) as Resolver<FullPropertyFormValues>,
    defaultValues: mapPropertyToForm(property),
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

    const { ...rest } = data;

    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const isArrayOrObject = typeof value === "object";
      if (isArrayOrObject) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    formData.append("id", property.id);

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
          submitLabel="Update Property"
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
          <MediaStep control={control} existingImages={property.images} />
        </Wizardry>
      </div>
    </form>
  );
};

export default UpdatePropertyContainer;
