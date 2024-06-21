import { useFormContext, Controller } from "react-hook-form";

import { TextField, TextFieldProps, styled } from "@mui/material";

interface IProps {
  name: string;
  children: any;
}

const RESTextField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputBase-input": {
      fontSize: "0.6rem",
    },
  },
}));

type Props = IProps & TextFieldProps;

export default function FormSelectField({ name, children, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <RESTextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </RESTextField>
      )}
    />
  );
}
