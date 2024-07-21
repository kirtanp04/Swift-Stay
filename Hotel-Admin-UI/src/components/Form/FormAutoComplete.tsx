/* eslint-disable no-self-compare */

import { Autocomplete, SxProps, TextField, styled } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type IProps<T, K extends keyof T> = {
  name: string;
  options: T[];
  placeholder?: string;
  DiaplayListByPropertyName: keyof T;
  SaveByPropertyName: K;
  defaultValue: T[K];
  sx?: SxProps;
};

type Props<T, K extends keyof T> = IProps<T, K>;

const MUIAutoComplete = styled(Autocomplete)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputBase-input": {
      fontSize: "0.7rem !important",
    },
  },
  width: "13rem",
  "& .MuiAutocomplete-clearIndicator": {
    display: "none",
  },
  "& .MuiAutocomplete-listbox": {
    fontSize: "0.6rem",
  },
}));

export default function FormAutoComplete<T, K extends keyof T>({
  name,
  options,
  placeholder,
  defaultValue,
  DiaplayListByPropertyName,
  SaveByPropertyName,
  sx,
}: Props<T, K>) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <MUIAutoComplete
          getOptionLabel={(option: any) =>
            option === ""
              ? ""
              : (option as unknown as any)[DiaplayListByPropertyName]
          }
          options={options}
          // isOptionEqualToValue={(option: any, value: any) => option.Id === value.Id}
          size="small"
          renderInput={(params) => (
            <TextField {...params} placeholder={placeholder || ""} />
          )}
          onChange={(event: any, values: any) => {
            onChange(values ? values[SaveByPropertyName] : null);
          }}
          defaultValue={options.find(
            (val: T) => val[SaveByPropertyName] === defaultValue
          )}
          sx={sx}
        />
      )}
    />
  );
}
