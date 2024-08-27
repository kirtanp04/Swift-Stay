import { Controller, FieldValues, useFormContext } from "react-hook-form";
import {
  RadioGroup,
  RadioGroupProps,
  FormControlLabel,
  Radio,
  FormHelperText,
  styled,
} from "@mui/material";
import { Fragment } from "react/jsx-runtime";

// ----------------------------------------------------------------------

type Props<T extends FieldValues> = {
  name: keyof T;
  options: { label: string; value: string | number | boolean }[]; // Options for radio buttons
} & RadioGroupProps;

const MUIStyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiFormControlLabel-label": {
      fontSize: "0.6rem",
    },
  },

  "& .MuiFormHelperText-root": {
    color: theme.palette.color.info.main,
    fontWeight: 600,
  },
}));

export default function FormRadioGroup<T extends FieldValues>({
  name,
  options,
  ...other
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Fragment>
          <MUIStyledRadioGroup {...field} {...other}>
            {options.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </MUIStyledRadioGroup>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Fragment>
      )}
    />
  );
}
