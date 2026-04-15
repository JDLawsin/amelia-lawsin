import { Controller, Control } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const SpecStep = ({ control }: Props) => (
  <div className="flex flex-col gap-5">
    <SectionLabel>Specs & Pricing</SectionLabel>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="price"
            label="Price"
            type="number"
            placeholder="e.g. 4500000"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        name="priceLabel"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="priceLabel"
            label="Price Label"
            placeholder="e.g. Negotiable / Cash Only"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
          />
        )}
      />

      <Controller
        name="floorArea"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="floorArea"
            label="Floor Area (sqm)"
            type="number"
            placeholder="e.g. 65"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        name="lotArea"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="lotArea"
            label="Lot Area (sqm)"
            type="number"
            placeholder="e.g. 120"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        name="bedrooms"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="bedrooms"
            label="Bedrooms"
            type="number"
            placeholder="e.g. 2"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        name="bathrooms"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="bathrooms"
            label="Bathrooms"
            type="number"
            placeholder="e.g. 2"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        name="parking"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="parking"
            label="Parking Slots"
            type="number"
            placeholder="e.g. 1"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />
    </div>

    <Controller
      name="monthlyRent"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="monthlyRent"
          label="Monthly Rent (if for rent)"
          type="number"
          placeholder="e.g. 25000"
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
          value={field.value ?? ""}
        />
      )}
    />
  </div>
);

export default SpecStep;
