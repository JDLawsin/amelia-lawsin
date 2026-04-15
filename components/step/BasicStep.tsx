import { Controller, Control } from "react-hook-form";
import FormTextArea from "@/components/ui/FormTextArea";
import SectionLabel from "@/components/ui/SectionLabel";
import { Separator } from "@/components/ui/shadcn/separator";
import FormCheckbox from "@/components/ui/FormCheckbox";
import FormSelect from "@/components/ui/FormSelect";
import FormInput from "@/components/ui/FormInput";
import { macroCaseToTitleCase } from "@/lib/string";
import {
  ListingType,
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/browser";
import { FullPropertyFormValues } from "../../app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const BasicStep = ({ control }: Props) => (
  <div className="flex flex-col gap-5">
    <SectionLabel>Basic information</SectionLabel>

    <Controller
      name="title"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="title"
          label="Title"
          placeholder="e.g. 2-Bedroom Condo at Avida Towers IT Park"
          required
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />

    <Controller
      name="slug"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="slug"
          label="Slug"
          placeholder="auto-generated from title"
          required
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          hint="Lowercase letters, numbers and hyphens only. Used in the URL."
          readOnly
          className="bg-muted/50 cursor-not-allowed" // visual cue
          {...field}
        />
      )}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelect
            id="type"
            name="type"
            label="Property type"
            options={Object.keys(PropertyType).map((key) => ({
              value: key,
              label:
                key === PropertyType.BEACH_VACATION
                  ? "Beach/Vacation"
                  : macroCaseToTitleCase(key),
            }))}
            placeholder="Select type..."
            required
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelect
            id="status"
            name="status"
            label="Status"
            options={Object.keys(PropertyStatus).map((key) => ({
              value: key,
              label: macroCaseToTitleCase(key),
            }))}
            placeholder="Select status..."
            required
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          />
        )}
      />

      <Controller
        name="listingType"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelect
            id="listingType"
            name="listingType"
            label="Listing type"
            options={Object.keys(ListingType).map((key) => ({
              value: key,
              label: macroCaseToTitleCase(key),
            }))}
            placeholder="Select listing type..."
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            value={field.value ?? "BRAND_NEW"}
            onValueChange={field.onChange}
          />
        )}
      />
    </div>

    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => (
        <FormTextArea
          id="description"
          label="Description"
          placeholder="Describe the property — location highlights, features, who it's ideal for."
          required
          rows={5}
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          hint="Minimum 10 characters."
          {...field}
        />
      )}
    />

    <Separator />
    <SectionLabel>Visibility</SectionLabel>

    <Controller
      name="isFeatured"
      control={control}
      render={({ field }) => (
        <FormCheckbox
          id="isFeatured"
          name="isFeatured"
          label="Mark as featured"
          hint="Featured properties appear on the homepage and are highlighted in listings."
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
        />
      )}
    />
  </div>
);

export default BasicStep;
