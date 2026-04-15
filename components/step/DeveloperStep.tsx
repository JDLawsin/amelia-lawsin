import { Controller, Control } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import SectionLabel from "@/components/ui/SectionLabel";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const DeveloperStep = ({ control }: Props) => (
  <div className="flex flex-col gap-5">
    <SectionLabel>Developer Information</SectionLabel>

    <Controller
      name="developerName"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="developerName"
          label="Developer Name"
          placeholder="e.g. Ayala Land, Vista Land"
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />

    <Controller
      name="projectPhase"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="projectPhase"
          label="Project Phase"
          placeholder="e.g. Phase 2, Tower A"
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />

    <Controller
      name="expectedTurnover"
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          id="expectedTurnover"
          label="Expected Turnover Date"
          placeholder="e.g. Q4 2027"
          errors={fieldState.error ? [fieldState.error.message!] : undefined}
          {...field}
        />
      )}
    />
  </div>
);

export default DeveloperStep;
