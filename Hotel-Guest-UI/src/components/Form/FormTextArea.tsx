// form
import { Controller, FieldValues, useFormContext } from "react-hook-form";
// @mui
import { TextareaAutosize, TextareaAutosizeProps, styled } from "@mui/material";

// ----------------------------------------------------------------------

type Props<T extends FieldValues> = {
  name: keyof T;
} & TextareaAutosizeProps;

const MUITextArea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: "8px",
  backgroundColor: "transparent",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.6rem",
  },

  fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
  border: `1px solid ${theme.palette.text.disabled}`,
  padding: "0.7rem",
  fontSize: "1rem",
}));

export default function FormTextArea<T extends FieldValues>({
  name,
  ...other
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }: any) => (
        <MUITextArea
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
