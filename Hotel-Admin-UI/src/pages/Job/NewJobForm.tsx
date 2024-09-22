import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { Country } from "country-state-city";
import getSymbolFromCurrency from "currency-symbol-map";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CloseCircleIcon,
  CloseIcon,
  LoadingAnimation,
  PlusIcon,
} from "src/assets/iconify";
import FormProvider from "src/components/Form/FormProvider";
import FormSelectField from "src/components/Form/FormSelectField";
import FormTextFiels from "src/components/Form/FormTextField";
import { RESIconButton } from "src/components/RESIconButton";
import Scrollbar from "src/components/Scrollbar";
import LoadingSkeleton from "src/components/Skeleton";
import useAuth from "src/hooks/useAuth";
import showMessage from "src/util/ShowMessage";
import * as yup from "yup";
import AddPropertyDialog from "../Property/AddPropertyDialog";
import { PropertyApi, PropertyClass } from "../Property/DataObject";
import {
  enumJobCategory,
  enumJobExperience,
  enumJobStatus,
  enumJobType,
  Job,
} from "./Dataobject";

type Props = {
  objJob: Job;
  onClose: () => void;
};

const AddJobSchema = yup.object().shape({
  PropertyID: yup.string().required("Property is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  location: yup.string().required("Location is required"),
  currency: yup.string().required("Currency is required"),
  JobType: yup.string().required("Job Type is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Status is required"),
  salary: yup.number().required("Salary is required"),

  requirements: yup
    .array()
    .of(yup.string().required("Requirement is required")),
  benefits: yup.array().of(yup.string().required("Benefits is required")),
  customInfo: yup.array().of(
    yup.object().shape({
      label: yup.string().required("Label is required"),
      value: yup.string().required("Value is required"),
    })
  ),
});

export default function NewJobForm({ objJob, onClose }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPropertyLoading, setShowPropertyLoading] =
    useState<boolean>(false);
  const [propertyList, setPropertyList] = useState<PropertyClass[]>([]);
  const [objProperty, setObjProperty] = useState<PropertyClass>(
    new PropertyClass()
  );
  const [showAddPropertyDialog, setShowAddProperty] = useState<boolean>(false);
  const [CurrencyList, setCurrencyList] = useState<string[]>([]);
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    try {
      if (objJob._id === "") {
        getAllProperty();
      }
    } catch (error: any) {
      showMessage(error.message, theme, () => {});
    }
  }, []);

  const getAllProperty = () => {
    setShowPropertyLoading(true);
    PropertyApi.getAllProperty(
      id,
      (res) => {
        setPropertyList(res);
        setShowPropertyLoading(false);
      },
      (err) => {
        showMessage(err, theme, () => {});
        setShowPropertyLoading(false);
      }
    );
  };

  const _Method = useForm<Job>({
    defaultValues: Job.getCopy(objJob),
    resolver: yupResolver(AddJobSchema) as any,
  });

  const { handleSubmit, watch, setValue, control } = _Method;
  const {
    fields: requirements,
    append: appendRequirements,
    remove: removeRequirementsField,
  } = useFieldArray({
    control,
    name: "requirements" as any,
  });

  const {
    fields: benefits,
    append: appendbenefits,
    remove: removebenefitsField,
  } = useFieldArray({
    control,
    name: "benefits" as any,
  });

  const {
    fields: customInfo,
    append: appendcustomInfo,
    remove: removecustomInfoField,
  } = useFieldArray({
    control,
    name: "customInfo",
  });

  useEffect(() => {
    if (objJob._id === "") {
      setValue("AdminID", id);
    }

    const Currency: string[] = [];
    Country.getAllCountries().map((objCountry) => {
      const value = getSymbolFromCurrency(objCountry.currency);
      if (value !== undefined) {
        Currency.push(value);
      }
    });

    setCurrencyList(Currency);
  }, []);

  useEffect(() => {
    const _watch = watch();

    if (objJob._id === "" && _watch.PropertyID !== "") {
      const Property = propertyList.find(
        (objProp) => objProp._id === _watch.PropertyID
      );
      if (Property !== undefined) {
        setValue("PropertyName", Property.name);
        setValue(
          "location",
          Property.zipCode +
            " | " +
            Property.address +
            ", " +
            Property.city +
            ", " +
            Property.state +
            ", " +
            Property.country
        );
      } else {
        showMessage(
          "There is some error while selecting property",
          theme,
          () => {}
        );
      }
    }
  }, [watch("PropertyID")]);

  const AddJob = (objJobInfo: Job) => {
    try {
      if (objJob._id === "") {
        // new job
        setLoading(true);
        Job.AddNewJob(
          objJobInfo,
          (res) => {
            setLoading(false);
            showMessage(res, theme, () => onClose());
          },
          (err) => {
            setLoading(false);
            showMessage(err, theme, () => {});
          }
        );
      }
    } catch (error: any) {
      showMessage(error.message, theme, () => {});
    }
  };

  const openAddPropertyDialog = () => {
    let _newObjProperty = new PropertyClass();
    _newObjProperty.adminID = id;
    setObjProperty(_newObjProperty);
    setShowAddProperty(true);
  };

  const AfterPropertySave = (objProperty: PropertyClass | undefined) => {
    getAllProperty();
    if (objProperty) {
    }
  };

  return (
    <Fragment>
      <Dialog open={true} maxWidth="xl" fullWidth>
        <DialogTitle>
          {objJob._id === "" ? "Create Job" : "Update Job"}
        </DialogTitle>
        <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />

        <FormProvider methods={_Method} onSubmit={handleSubmit(AddJob)}>
          <DialogContent
            sx={{
              height: { sm: 400, md: 450, xl: 550 },
              maxHeight: { sm: 400, md: 450, xl: 550 },
            }}
          >
            <Scrollbar
              sx={{
                height: "100%",
                width: "100%",
              }}
            >
              <Grid container width={"100%"}>
                <Grid xl={4} item>
                  <FieldWrapper>
                    {objJob._id === "" ? (
                      <LoadingSkeleton
                        isLoading={showPropertyLoading}
                        sx={{ width: "100%" }}
                      >
                        {propertyList.length === 0 ? (
                          <Button
                            startIcon={<PlusIcon />}
                            variant="outlined"
                            onClick={openAddPropertyDialog}
                          >
                            Create Property First
                          </Button>
                        ) : (
                          <FormSelectField
                            variant="outlined"
                            label="Property"
                            name="PropertyID"
                            sx={{ width: "100%" }}
                          >
                            <option value={""} />
                            {propertyList.map((objProperty) => (
                              <option
                                value={objProperty._id}
                                key={objProperty._id}
                              >
                                {objProperty.name}
                              </option>
                            ))}
                          </FormSelectField>
                        )}
                      </LoadingSkeleton>
                    ) : (
                      <FormTextFiels
                        variant="outlined"
                        label="Property"
                        name="PropertyName"
                        sx={{ width: "100%" }}
                        disabled
                      />
                    )}
                  </FieldWrapper>
                </Grid>

                <Grid xl={4} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormTextFiels
                        name="title"
                        label="Title"
                        fullWidth
                        variant="outlined"
                      />
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={4} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormTextFiels
                        name="description"
                        label="Description"
                        fullWidth
                        variant="outlined"
                      />
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={2} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormSelectField
                        variant="outlined"
                        label="JobType"
                        name="JobType"
                      >
                        <option value={enumJobType.FULL_TIME}>Full time</option>
                        <option value={enumJobType.PART_TIME}>Part time</option>
                        <option value={enumJobType.CONTRACT}>Contract</option>
                      </FormSelectField>
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={3} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormSelectField
                        variant="outlined"
                        name="category"
                        label="Category"
                      >
                        <option value={enumJobCategory.ADMINISTRATION}>
                          Administration
                        </option>
                        <option value={enumJobCategory.CLEANING}>
                          Cleaning
                        </option>
                        <option value={enumJobCategory.MAINTENANCE}>
                          Maintenance
                        </option>
                        <option value={enumJobCategory.MANAGEMENT}>
                          Management
                        </option>
                        <option value={enumJobCategory.ROOM_SERVICE}>
                          Room service
                        </option>
                        <option value={enumJobCategory.SECURITY}>
                          Security
                        </option>
                        <option value={enumJobCategory.OTHER}>Other</option>
                      </FormSelectField>
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={2} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormTextFiels
                        name="location"
                        label="Location"
                        fullWidth
                        variant="outlined"
                      />
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={3} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormTextFiels
                        name="salary"
                        label="salary"
                        fullWidth
                        variant="outlined"
                        type="number"
                      />
                    </InputWrapper>

                    <InputWrapper>
                      <FormSelectField
                        variant="outlined"
                        label="currency"
                        name="currency"
                        sx={{ width: "7rem" }}
                      >
                        <option value=""></option>
                        {CurrencyList.map((curr, i) => (
                          <option value={curr} key={i}>
                            {curr}
                          </option>
                        ))}
                      </FormSelectField>
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={2} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormSelectField
                        variant="outlined"
                        label="Experience"
                        name="experience"
                      >
                        <option value={enumJobExperience.NoExpe}>
                          {enumJobExperience.NoExpe}
                        </option>
                        <option value={enumJobExperience.AtLeastSixMonth}>
                          {enumJobExperience.AtLeastSixMonth}
                        </option>
                        <option value={enumJobExperience.OneYear}>
                          {enumJobExperience.OneYear}
                        </option>
                        <option value={enumJobExperience.OneAndhalf}>
                          {enumJobExperience.OneAndhalf}
                        </option>
                        <option value={enumJobExperience.TwoToFour}>
                          {enumJobExperience.TwoToFour}
                        </option>
                        <option value={enumJobExperience.More}>
                          {enumJobExperience.More}
                        </option>
                      </FormSelectField>
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                <Grid xl={2} item>
                  <FieldWrapper>
                    <InputWrapper>
                      <FormSelectField
                        variant="outlined"
                        label="Job status"
                        name="status"
                      >
                        <option value={enumJobStatus.OPEN}>Open</option>
                        <option value={enumJobStatus.CLOSED}>Close</option>
                        <option value={enumJobStatus.PENDING}>Pending</option>
                      </FormSelectField>
                    </InputWrapper>
                  </FieldWrapper>
                </Grid>

                {/* divider line */}
                <Grid xl={12}>
                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: theme.palette.border,
                      margin: "1rem",
                    }}
                  />
                </Grid>

                <Grid xl={12} item>
                  <Typography>Requirements</Typography>
                  <FieldWrapper
                    sx={{
                      flexWrap: "wrap",
                    }}
                  >
                    {requirements.map((field, i) => (
                      <Box key={field.id} position={"relative"}>
                        <FormTextFiels
                          label="Requirement"
                          name={`requirements.${i}`}
                          sx={{ width: "15rem" }}
                        />
                        <CloseCircleIcon
                          style={{
                            position: "absolute",
                            right: -4,
                            top: -8,
                            cursor: "pointer",
                          }}
                          onClick={() => removeRequirementsField(i)}
                        />
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      onClick={() => appendRequirements("")}
                    >
                      <PlusIcon />
                    </Button>
                  </FieldWrapper>
                </Grid>

                {/* divider line */}
                <Grid xl={12}>
                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: theme.palette.border,
                      margin: "1rem",
                    }}
                  />
                </Grid>

                <Grid xl={12} item>
                  <Typography>Benefits</Typography>
                  <FieldWrapper
                    sx={{
                      flexWrap: "wrap",
                    }}
                  >
                    {benefits.map((field, i) => (
                      <Box key={field.id} position={"relative"}>
                        <FormTextFiels
                          label="Benefit"
                          name={`benefits.${i}`}
                          sx={{ width: "15rem" }}
                        />
                        <CloseCircleIcon
                          style={{
                            position: "absolute",
                            right: -4,
                            top: -8,
                            cursor: "pointer",
                          }}
                          onClick={() => removebenefitsField(i)}
                        />
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      onClick={() => appendbenefits("")}
                    >
                      <PlusIcon />
                    </Button>
                  </FieldWrapper>
                </Grid>

                {/* divider line */}
                <Grid xl={12}>
                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: theme.palette.border,
                      margin: "1rem",
                    }}
                  />
                </Grid>

                <Grid xl={12} item>
                  <Typography>Custom Information</Typography>
                  <FieldWrapper
                    sx={{
                      flexWrap: "wrap",
                    }}
                  >
                    {customInfo.map((field, i) => (
                      <Box
                        key={field.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          position: "relative",
                        }}
                      >
                        <FormTextFiels
                          label="Label"
                          name={`customInfo.${i}.label`}
                          sx={{ width: "10rem" }}
                        />

                        <FormTextFiels
                          label="Detail"
                          name={`customInfo.${i}.value`}
                          sx={{ width: "15rem" }}
                        />
                        <CloseCircleIcon
                          style={{
                            position: "absolute",
                            right: -4,
                            top: -8,
                            cursor: "pointer",
                          }}
                          onClick={() => removecustomInfoField(i)}
                        />
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      onClick={() => appendcustomInfo({ label: "", value: "" })}
                    >
                      <PlusIcon />
                    </Button>
                  </FieldWrapper>
                </Grid>
              </Grid>
            </Scrollbar>
          </DialogContent>

          <Divider orientation="horizontal" flexItem />

          <DialogActions>
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
      </Dialog>

      {showAddPropertyDialog && (
        <AddPropertyDialog
          objProperty={objProperty}
          onClose={() => setShowAddProperty(false)}
          afterSave={AfterPropertySave}
        />
      )}
    </Fragment>
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
