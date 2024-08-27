import { Alert, Box, styled, useTheme } from "@mui/material";
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from "country-state-city";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FormRadioGroup from "src/components/Form/FormRadioGroup";
import FormSelectField from "src/components/Form/FormSelectField";
import FormTextField from "src/components/Form/FormTextField";
import useAuth from "src/hooks/useAuth";
import { Booking } from "src/ObjMgr/Booking";
import * as yup from "yup";
import { FlexWrapper, MUIDivider, SubTitle } from "./CommonStyle";
type Props = {
  _Method: UseFormReturn<Booking, any, undefined>;
};

export const BookingFormSchema = yup.object().shape({
  UserInfo: yup.object().shape({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    zipCode: yup.string().min(4).required("ZipCode is required"),
    phone: yup.string().required("Phone is required"),
  }),
});

export default function BookinForm({ _Method }: Props) {
  const [Countries] = useState<ICountry[]>(Country.getAllCountries());
  const [States, setState] = useState<IState[]>([]);
  const [Cities, setCities] = useState<ICity[]>([]);
  const {
    user: {
      userInfo: {},
    },
  } = useAuth();
  const theme = useTheme();

  const { watch } = _Method;

  useEffect(() => {
    const _watch = watch();

    if (_watch.UserInfo.country !== "") {
      const countryCode = _watch.UserInfo.country.split("-")[1];
      const _states = State.getStatesOfCountry(countryCode);
      setState(_states);
    }
  }, [watch("UserInfo.country")]);

  useEffect(() => {
    const _watch = watch();

    if (_watch.UserInfo.state !== "" && _watch.UserInfo.country !== "") {
      const countryCode = _watch.UserInfo.country.split("-")[1];
      const stateCode = _watch.UserInfo.state.split("-")[1];
      const cities = City.getCitiesOfState(countryCode, stateCode);
      setCities(cities);
    }
  }, [watch("UserInfo.state")]);

  return (
    <Rootstyle>
      <FlexWrapper sx={{ fontSize: "1.5rem" }}>Enter your details</FlexWrapper>

      <Alert severity="info" color="info">
        Almost done! Just fill in the
        <span style={{ color: theme.palette.color.error.main }}> *</span>{" "}
        required info
      </Alert>

      <FlexWrapper sx={{ marginTop: "1rem" }}>
        <FormTextField
          name="UserInfo.name"
          variant="outlined"
          label="Full name"
          fullWidth
        />
        <FormTextField
          name="UserInfo.email"
          variant="outlined"
          label="Email "
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </FlexWrapper>

      <MUIDivider />

      <FlexWrapper>
        <SubTitle>Your address</SubTitle>
      </FlexWrapper>

      <FlexWrapper>
        <FormTextField
          name="UserInfo.address"
          variant="outlined"
          label="Address"
          fullWidth
        />
      </FlexWrapper>

      <FlexWrapper>
        <FormSelectField
          variant="outlined"
          label="Country"
          name="UserInfo.country"
          fullWidth
        >
          <option value=""></option>
          {Countries.map((objCountry) => (
            <option
              key={objCountry.isoCode}
              value={objCountry.name + "-" + objCountry.isoCode}
            >
              {objCountry.name}
            </option>
          ))}
        </FormSelectField>

        <FormSelectField
          fullWidth
          variant="outlined"
          name="UserInfo.state"
          label="State"
          InputProps={{
            readOnly: States.length === 0,
          }}
        >
          <option value=""></option>
          {States.map((objState) => (
            <option
              value={objState.name + "-" + objState.isoCode}
              key={objState.isoCode}
            >
              {objState.name}
            </option>
          ))}
        </FormSelectField>
      </FlexWrapper>

      <FlexWrapper>
        <FormSelectField
          fullWidth
          variant="outlined"
          name="UserInfo.city"
          label="City"
          InputProps={{
            readOnly: Cities.length === 0,
          }}
        >
          <option value=""></option>
          {Cities.map((objCity) => (
            <option value={objCity.name} key={objCity.countryCode}>
              {objCity.name}
            </option>
          ))}
        </FormSelectField>

        <FormTextField
          name="UserInfo.ZipCode"
          variant="outlined"
          label="ZipCode"
          fullWidth
        />
      </FlexWrapper>

      <FlexWrapper>
        <FormTextField
          name="UserInfo.phone"
          variant="outlined"
          label="Phone"
          fullWidth
          type="number"
          helperText="So the accommodation can reach you"
          sx={{ width: "50%" }}
        />
      </FlexWrapper>

      <MUIDivider />

      <FlexWrapper>
        <SubTitle>Who are you booking for?</SubTitle>
      </FlexWrapper>

      <FormRadioGroup
        name="WhoAreYouBookingFor"
        options={[
          { label: "I am the main guest", value: "I am the main guest" },
          {
            label: "Booking is for someone else",
            value: "Booking is for someone else",
          },
        ]}
      />

      <FlexWrapper>
        <SubTitle>Are you travelling for work?</SubTitle>
      </FlexWrapper>

      <FormRadioGroup
        name="AreYouTravellingForWork"
        options={[
          { label: "Yes", value: true },
          {
            label: "No",
            value: false,
          },
        ]}
      />
    </Rootstyle>
  );
}

const Rootstyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  gap: "10px",
  flexDirection: "column",
}));
