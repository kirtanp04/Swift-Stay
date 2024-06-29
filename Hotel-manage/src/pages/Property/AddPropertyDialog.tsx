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
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CloseCircleIcon,
  CloseIcon,
  PlusIcon,
  UpdateIcon,
} from "src/assets/iconify";
import FormProvider from "src/components/Form/FormProvider";
import FormSelectField from "src/components/Form/FormSelectField";
import FormTextArea from "src/components/Form/FormTextArea";
import FormTextFiels from "src/components/Form/FormTextField";
import { RESIconButton } from "src/components/RESIconButton";
import Scrollbar from "src/components/Scrollbar";
import showMessage from "src/util/ShowMessage";
import * as yup from "yup";
import { PropertyApi, PropertyClass, enumPropertyType } from "./DataObject";
import UploadPropertyImage from "./UploadPropertyImage";

type Props = {
  onClose: () => void;
  objHotel: PropertyClass;
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

export default function AddPropertyDialog({ onClose, objHotel }: Props) {
  const [showUploadImageDialog, setShowUploadImageDialog] =
    useState<boolean>(false);

  const [ImageList, setImageList] = useState<any[]>([]);
  const theme = useTheme();

  //------------------------------- Form

  const _Method = useForm<PropertyClass>({
    defaultValues: objHotel,
    resolver: yupResolver(AddHotelSchema) as any,
  });
  const { handleSubmit, control } = _Method;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  //---------------------------------------------

  const openUploadImageDialog = () => {
    setShowUploadImageDialog(true);
  };
  const closeUploadImageDialog = () => {
    setShowUploadImageDialog(false);
  };

  const SaveImageList = (ImageList: any[]) => {
    setImageList(ImageList);
  };

  const onAddHotel = (objHotelData: PropertyClass) => {
    if (ImageList.length >= 1 || objHotelData.images.length >= 1) {
      if (objHotelData._id === "") {
        ImageList.forEach((objImage) =>
          objHotelData.images.push(objImage.File[0])
        );

        PropertyApi.addNewProperty(
          objHotelData,
          (res) => {},
          (err) => {}
        );
        // new one
      } else {
        // update
      }
    } else {
      showMessage("Select atleast One Hotel Image", theme, () => {});
    }
  };
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Add Property</DialogTitle>
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
                <FormTextFiels
                  name="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>

              <InputWrapper>
                <FormTextFiels
                  name="city"
                  label="City"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>
            </FieldWrapper>

            <FieldWrapper>
              <InputWrapper>
                <FormTextFiels
                  name="state"
                  label="State"
                  fullWidth
                  variant="outlined"
                />
              </InputWrapper>

              <InputWrapper>
                <FormTextFiels
                  name="country"
                  label="Country"
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
            starticon={<PlusIcon />}
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
        <UploadPropertyImage
          onClose={closeUploadImageDialog}
          onSaveImages={SaveImageList}
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
