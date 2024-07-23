import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
  useTheme,
} from "@mui/material";
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from "country-state-city";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CloseCircleIcon,
  CloseIcon,
  LoadingAnimation,
  PlusIcon,
  UpdateIcon,
} from "src/assets/iconify";
import FormProvider from "src/components/Form/FormProvider";
import FormSelectField from "src/components/Form/FormSelectField";
import FormTextArea from "src/components/Form/FormTextArea";
import FormTextFiels from "src/components/Form/FormTextField";
import { RESIconButton } from "src/components/RESIconButton";
import Scrollbar from "src/components/Scrollbar";
import UploadImage from "src/components/UploadImage";
import showMessage from "src/util/ShowMessage";
import * as yup from "yup";
import { PropertyApi, PropertyClass, enumPropertyType } from "./DataObject";

type Props = {
  onClose: () => void;
  objProperty: PropertyClass;
  afterSave?: (objPropertyData?: PropertyClass) => void;
};

const AddHotelSchema = yup.object().shape({
  name: yup.string().required("Hotel name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  zipCode: yup.string().min(4).required("ZipCode is required"),
  phone: yup.string().required("Phone is required"),
  website: yup.string().required("Website is required"),
  amenities: yup.array().of(yup.string().required("Amenity is required")),
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Public Email is required"),
});

export default function AddPropertyDialog({
  onClose,
  objProperty,
  afterSave,
}: Props) {
  const [showUploadImageDialog, setShowUploadImageDialog] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [_objProperty, setObjProperty] = useState<PropertyClass>(objProperty);

  const [Countries] = useState<ICountry[]>(Country.getAllCountries());
  const [States, setState] = useState<IState[]>([]);
  const [Cities, setCities] = useState<ICity[]>([]);

  const theme = useTheme();

  //------------------------------- Form

  const _Method = useForm<PropertyClass>({
    defaultValues: objProperty,
    resolver: yupResolver(AddHotelSchema) as any,
  });
  const { handleSubmit, control, watch } = _Method;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  //---------------------------------------------

  useEffect(() => {
    const _watch = watch();

    if (_watch.country !== "") {
      const stateList = getAllStatesOfoneCountry(_watch.country);
      setState(stateList);
    }
  }, [watch("country")]);

  useEffect(() => {
    const _watch = watch();

    if (_watch.state !== "") {
      const cities = getAllCities(_watch.country, _watch.state);
      setCities(cities);
    }
  }, [watch("state")]);
  //----------------------------------------------------------------

  const getAllStatesOfoneCountry = (countryName: string): IState[] => {
    let States: IState[] = [];
    for (let index = 0; index < Countries.length; index++) {
      const element = Countries[index];

      if (element.name === countryName) {
        States = State.getStatesOfCountry(element.isoCode);

        break;
      }
    }

    return States;
  };

  const getAllCities = (countryName: string, stateName: string): ICity[] => {
    let Cities: ICity[] = [];
    let find: boolean = false;

    do {
      for (
        let CountryIndex = 0;
        CountryIndex < Countries.length;
        CountryIndex++
      ) {
        const objCountry = Countries[CountryIndex];

        if (objCountry.name === countryName) {
          for (let StateIndex = 0; StateIndex < States.length; StateIndex++) {
            const objState = States[StateIndex];
            if (objState.name === stateName) {
              Cities = City.getCitiesOfState(
                objCountry.isoCode,
                objState.isoCode
              );
              find = true;
              break;
            }
          }

          break;
        }
      }
    } while (!find);

    return Cities;
  };

  // ----------------------------------------------------------

  const openUploadImageDialog = () => {
    setShowUploadImageDialog(true);
  };
  const closeUploadImageDialog = () => {
    setShowUploadImageDialog(false);
  };

  const SaveImageList = (ImageList: any[]) => {
    setObjProperty({ ..._objProperty, images: ImageList });
  };

  const onAddHotel = (objPropertyData: PropertyClass) => {
    if (_objProperty.images.length >= 1 || objPropertyData.images.length >= 1) {
      objPropertyData.images = [];
      _objProperty.images.forEach((img) => objPropertyData.images.push(img));
      if (objPropertyData._id === "") {
        setLoading(true);
        PropertyApi.addNewProperty(
          objPropertyData,
          (res) => {
            setLoading(false);
            showMessage(res, theme, () => onClose());
            if (afterSave !== undefined) {
              afterSave(objPropertyData);
            }
          },
          (err) => {
            setLoading(false);
            showMessage(err, theme, () => {});
          }
        );
      } else {
        // update

        setLoading(true);
        PropertyApi.updateProperty(
          objPropertyData,
          (res) => {
            setLoading(false);
            showMessage(res, theme, () => onClose());
            if (afterSave !== undefined) {
              afterSave(objPropertyData);
            }
          },
          (err) => {
            setLoading(false);
            showMessage(err, theme, () => {});
          }
        );
      }
    } else {
      showMessage("Select atleast One Hotel Image", theme, () => {});
    }
  };
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>
        {_objProperty._id === "" ? "Add Property" : "Update Property"}
      </DialogTitle>
      <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
      <FormProvider methods={_Method} onSubmit={handleSubmit(onAddHotel)}>
        <DialogContent
          sx={{
            height: { sm: 400, md: 450, xl: 500 },
            maxHeight: { sm: 400, md: 450, xl: 500 },
          }}
        >
          <Scrollbar sx={{ height: "100%" }}>
            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="adminID"
                  label="admin"
                  fullWidth
                  variant="outlined"
                  disabled
                />
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="name"
                  label="Hotel name"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>

              <InputWrapper>
                <FormSelectField
                  variant="outlined"
                  label="Property type"
                  name="propertyType"
                >
                  <option value={enumPropertyType.Hotel}>Hotel</option>
                  <option value={enumPropertyType.Apartment}>Apartment</option>
                  <option value={enumPropertyType.Bungalow}>Bunglow</option>
                  <option value={enumPropertyType.Resort}>Resort</option>
                </FormSelectField>
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormSelectField
                  variant="outlined"
                  label="Country"
                  name="country"
                >
                  <option value=""></option>
                  {Countries.map((objCountry) => (
                    <option value={objCountry.name} key={objCountry.isoCode}>
                      {objCountry.name}
                    </option>
                  ))}
                </FormSelectField>
              </InputWrapper>

              <InputWrapper>
                <FormSelectField
                  variant="outlined"
                  name="state"
                  label="State"
                  disabled={States.length === 0}
                >
                  <option value=""></option>
                  {States.map((objState) => (
                    <option value={objState.name} key={objState.isoCode}>
                      {objState.name}
                    </option>
                  ))}
                </FormSelectField>
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormSelectField
                  variant="outlined"
                  name="city"
                  label="City"
                  disabled={Cities.length === 0}
                >
                  <option value=""></option>
                  {Cities.map((objCity) => (
                    <option value={objCity.name} key={objCity.countryCode}>
                      {objCity.name}
                    </option>
                  ))}
                </FormSelectField>
              </InputWrapper>

              <InputWrapper>
                <FormTextFiels
                  name="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="zipCode"
                  label="Zip"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>

              <InputWrapper>
                <FormTextFiels
                  name="phone"
                  label="Phone "
                  fullWidth
                  variant="outlined"
                  type="number"
                />
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="email"
                  label="Public email"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>

              <InputWrapper>
                <FormTextFiels
                  name="website"
                  label="Website"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormTextArea
                  minRows={3}
                  name="description"
                  placeholder="Description"
                  style={{ width: "100%" }}
                />
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper
              sx={{
                flexWrap: "wrap",
              }}
            >
              {fields.map((field, index) => (
                <Box key={field.id} position={"relative"}>
                  <FormTextFiels
                    label="Amenitie"
                    name={`amenities.${index}`}
                    sx={{ width: "9rem" }}
                  />
                  <CloseCircleIcon
                    style={{
                      position: "absolute",
                      right: -4,
                      top: -8,
                      cursor: "pointer",
                    }}
                    onClick={() => remove(index)}
                  />
                </Box>
              ))}

              <RESIconButton
                iconposition="start"
                starticon={<PlusIcon />}
                variant="outlined"
                onClick={() => append("")}
              >
                Add Amenities
              </RESIconButton>
            </FieldWrapper>
          </Scrollbar>
        </DialogContent>
        <Divider orientation="horizontal" flexItem />
        <DialogActions>
          <Button
            onClick={openUploadImageDialog}
            startIcon={<UpdateIcon />}
            variant="outlined"
            sx={{ marginRight: "auto" }}
          >
            Upload Image
          </Button>
          <RESIconButton
            iconposition="start"
            starticon={loading ? <LoadingAnimation /> : <PlusIcon />}
            variant="outlined"
            type="submit"
          >
            Add
          </RESIconButton>
          <RESIconButton
            iconposition="start"
            starticon={<CloseIcon />}
            variant="contained"
            type="submit"
            onClick={onClose}
          >
            Close
          </RESIconButton>
        </DialogActions>
      </FormProvider>

      {showUploadImageDialog && (
        <UploadImage
          onClose={closeUploadImageDialog}
          onSaveImages={SaveImageList}
          imageList={_objProperty.images}
          Tilte="Property Image"
        />
      )}
    </Dialog>
  );
}

const FieldWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "0.8rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",

  gap: "1rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));
