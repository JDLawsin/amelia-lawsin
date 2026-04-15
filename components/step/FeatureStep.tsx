import { Controller, Control } from "react-hook-form";
import FormCheckbox from "@/components/ui/FormCheckbox";
import SectionLabel from "@/components/ui/SectionLabel";
import { FullPropertyFormValues } from "@/app/(admin)/admin/properties/_schema/property.schema";

type Props = {
  control: Control<FullPropertyFormValues>;
};

const FeatureStep = ({ control }: Props) => (
  <div className="flex flex-col gap-5">
    <SectionLabel>Features & Amenities</SectionLabel>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Controller
        name="isPagibigAccredited"
        control={control}
        render={({ field }) => (
          <FormCheckbox
            id="isPagibigAccredited"
            name="isPagibigAccredited"
            label="Pag-IBIG Accredited"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isBankFinancingReady"
        control={control}
        render={({ field }) => (
          <FormCheckbox
            id="isBankFinancingReady"
            name="isBankFinancingReady"
            label="Bank Financing Ready"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isInHouseFinancing"
        control={control}
        render={({ field }) => (
          <FormCheckbox
            id="isInHouseFinancing"
            name="isInHouseFinancing"
            label="In-House Financing Available"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isRentToOwn"
        control={control}
        render={({ field }) => (
          <FormCheckbox
            id="isRentToOwn"
            name="isRentToOwn"
            label="Rent-to-Own Available"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isAirbnbReady"
        control={control}
        render={({ field }) => (
          <FormCheckbox
            id="isAirbnbReady"
            name="isAirbnbReady"
            label="Airbnb Ready"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isTourismZoned"
        control={control}
        render={({ field }) => (
          <FormCheckbox
            id="isTourismZoned"
            name="isTourismZoned"
            label="Tourism Zoned"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  </div>
);

export default FeatureStep;
