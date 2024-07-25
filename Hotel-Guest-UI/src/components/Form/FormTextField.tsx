// form
import { Controller, FieldValues, useFormContext } from "react-hook-form";
// @mui
import { TextField, TextFieldProps, styled } from "@mui/material";

// ----------------------------------------------------------------------

type Props<T extends FieldValues> = {
  name: keyof T;
} & TextFieldProps;

export const MUITextField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputBase-input": {
      fontSize: "0.6rem",
    },
  },
}));

export default function FormTextField<T extends FieldValues>({
  name,
  ...other
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MUITextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
