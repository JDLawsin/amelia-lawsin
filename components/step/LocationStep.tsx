import { Controller, Control } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const LocationStep = ({ control }: Props) => (
  <div className="flex flex-col gap-5">
    <SectionLabel>Location</SectionLabel>

    <Controller
      name="address"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="address"
          label="Address"
          placeholder="e.g. 123 Main Street, IT Park"
          required
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />

    <Controller
      name="city"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="city"
          label="City"
          placeholder="e.g. Cebu City"
          required
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />

    <Controller
      name="barangay"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="barangay"
          label="Barangay"
          placeholder="e.g. Mabolo"
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />

    <div className="grid grid-cols-2 gap-4">
      <Controller
        name="latitude"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="latitude"
            label="Latitude"
            type="number"
            placeholder="e.g. 10.3157"
            step="0.000001"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      <Controller
        name="longitude"
        control={control}
        render={({ field, fieldState }) => (
          <FormInput
            id="longitude"
            label="Longitude"
            type="number"
            placeholder="e.g. 123.8854"
            step="0.000001"
            errors={fieldState.error ? [fieldState.error.message!] : undefined}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />
    </div>
  </div>
);

export default LocationStep;
