// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  FormGroup,
  styled,
} from "@mui/material";

// ----------------------------------------------------------------------

interface RHFCheckboxProps extends Omit<FormControlLabelProps, "control"> {
  name: string;
}

const MUICheckBox = styled(Checkbox)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiSvgIcon-fontSizeMedium": {
      height: "18px !important",
      width: "18px !important",
    },
    "&.MuiButtonBase-root": {
      height: 13,
      width: 13,
    },
  },
}));

export function FormCheckbox({ name, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <MUICheckBox {...field} checked={field.value} />
          )}
        />
      }
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps
  extends Omit<FormControlLabelProps, "control" | "label"> {
  name: string;
  options: {
    label: string;
    value: any;
  }[];
}

export function RHFMultiCheckbox({
  name,
  options,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option: string) =>
          field.value.includes(option)
            ? field.value.filter((value: string) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
                  />
                }
                label={option.label}
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}
