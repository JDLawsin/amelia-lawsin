"use client";

import { startTransition, useActionState, useState } from "react";
import {
  FullPropertyFormValues,
  FullPropertySchema,
  PROPERTY_TABS,
  STEP_FIELD_NAMES,
} from "../../../_schema/property.schema";
import {
  FormState,
  restorePropertyAction,
  updatePropertyAction,
} from "@/actions/property.action";
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
import { getPropertyRedirectPath } from "@/lib/property-redirect";
import { PropertyAdminDetail } from "@/services/property.admin.service";
import PageHeader from "@/components/ui/PageHeader";
import DeletedRestorePanel from "@/components/ui/DeletedRestorePanel";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  PROPERTY_VISIBILITY_LABELS,
  PROPERTY_VISIBILITY_STYLES,
} from "@/constants";

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

    const imageItemsForServer = data.imageItems.map((item) => ({
      id: item.id,
      caption: item.caption,
      order: item.order,
      isPrimary: item.isPrimary,
    }));
    formData.append("imageItems", JSON.stringify(imageItemsForServer));

    const originalImageIds = property.images.map((image) => image.id);
    const currentImageIds = data.imageItems
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));
    const deletedImageIds = originalImageIds.filter(
      (id) => !currentImageIds.includes(id),
    );
    if (deletedImageIds.length > 0) {
      formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
    }

    data.imageItems.forEach((item) => {
      if (item.file) {
        formData.append("imageFiles", item.file);
      }
    });

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
    formData.append("id", property.id);

    startTransition(() => {
      formAction(formData);
    });
  });

  useFormActionEffect(state, {
    getRedirectPath: getPropertyRedirectPath,
  });

  if (property.deletedAt) {
    return (
      <DeletedRestorePanel
        title={property.title}
        subtitle="Edit property"
        badgeLabel={PROPERTY_VISIBILITY_LABELS.deleted}
        badgeClassName={PROPERTY_VISIBILITY_STYLES.deleted}
        description="This listing is in trash and can't be edited. Restore it to continue updating details, publishing, or featuring it."
        backHref="/admin/properties?visibility=deleted"
        backLabel="Back to trash"
        onRestore={() => restorePropertyAction(property.id)}
      />
    );
  }

  const visibility = property.isPublished ? "published" : "draft";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={
          <>
            <span className="truncate">{property.title}</span>
            <Badge className={PROPERTY_VISIBILITY_STYLES[visibility]}>
              {PROPERTY_VISIBILITY_LABELS[visibility]}
            </Badge>
          </>
        }
        subtitle="Edit property"
        action={
          property.isPublished ? (
            <Link
              href={`/properties/${property.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-9 px-4 border border-wire bg-white text-ink text-sm font-medium rounded-xl hover:bg-cloud transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View public
            </Link>
          ) : undefined
        }
      />

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
            <MediaStep control={control} />
          </Wizardry>
        </div>
      </form>
    </div>
  );
};

export default UpdatePropertyContainer;
