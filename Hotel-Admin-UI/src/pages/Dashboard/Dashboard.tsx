import {
  alpha,
  Box,
  Grid,
  ListItemIcon,
  MenuItem,
  MenuList,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { Country, ICountry } from "country-state-city";
import { useCallback, useEffect, useState } from "react";
import {
  HorizontalMenuIcon,
  HotelIcon,
  ProfitDecreaseIcon,
  ProfitIncreaseIcon,
} from "src/assets/iconify";
import { MUIMenu } from "src/components/mui/MUIMenu";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import useAuth from "src/hooks/useAuth";
import getFlagClassName from "src/util/getCountryFlagUrl";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";
import {
  Analytic,
  AnalyticlsImgs,
  TAllPropertyByState,
  TPropertyProfitByMonth,
} from "./DataObject";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export default function Dashboard() {
  const [AnalyticData, setOverviewMatrix] = useState<Analytic>(new Analytic());
  const [propertListbyState, setPropertyListbyState] = useState<
    TAllPropertyByState[]
  >([]);
  const [PropertyProfit, setPropertProfit] = useState<TPropertyProfitByMonth[]>(
    []
  );
  const [countryList, setCountryList] = useState<ICountry[]>([]);
  const [anchorPointPropertyByState, setAnchorPointPropertyByState] =
    useState<null | HTMLElement>(null);
  const openCtxMenuPointOne = Boolean(anchorPointPropertyByState);

  const theme = useTheme();
  const {
    user: {
      userInfo: { id, country },
    },
  } = useAuth();

  const [SelectedCountry, setSelectedCountry] = useState<string>(country);

  useEffect(() => {
    showLoading(theme, true);
    loadAnalyticdata();

    async function loadAnalyticdata() {
      await Promise.all([
        GetOverviewMetrics(),
        GetPropertyByState(country),
        GetPropertyProfitByMonth(2024),
      ])
        .then((res) => {
          setOverviewMatrix(res[0]);
          setPropertyListbyState(res[1]);
          setPropertProfit(res[2]);
        })
        .catch((err) => {
          showMessage(err, theme, () => {});
        })
        .finally(() => {
          showLoading(theme, false);
        });
    }
  }, []);

  useEffect(() => {
    if (countryList.length === 0) {
      setCountryList(Country.getAllCountries());
    }
  }, []);

  const GetOverviewMetrics = useCallback(async (): Promise<Analytic> => {
    const res: Analytic = await new Promise(async (resolve, reject) => {
      try {
        await Analytic.GetOverviewMetrics(
          id,
          (obj: Analytic) => {
            resolve(obj);
          },
          (err) => {
            reject(err);
          }
        );
      } catch (error: any) {
        reject(error.message);
      }
    });
    return res;
  }, []);

  const GetPropertyByState = useCallback(
    async (countryname: string): Promise<TAllPropertyByState[]> => {
      const res: TAllPropertyByState[] = await new Promise(
        async (resolve, reject) => {
          try {
            await Analytic.GetPropertyByState(
              id,
              countryname,
              (obj: any) => {
                resolve(obj);
              },
              (err) => {
                reject(err);
              }
            );
          } catch (error: any) {
            reject(error.message);
          }
        }
      );
      return res;
    },
    []
  );

  const GetPropertyProfitByMonth = useCallback(
    async (year: number): Promise<TPropertyProfitByMonth[]> => {
      const res: TPropertyProfitByMonth[] = await new Promise(
        async (resolve, reject) => {
          try {
            await Analytic.GetPropertyProfitByMonth(
              id,
              year,
              (obj: any) => {
                resolve(obj);
              },
              (err) => {
                reject(err);
              }
            );
          } catch (error: any) {
            reject(error.message);
          }
        }
      );
      return res;
    },
    []
  );

  const onSelectCountry = async (objCountry: ICountry) => {
    setAnchorPointPropertyByState(null);

    if (`${objCountry.name}-${objCountry.isoCode}` !== SelectedCountry) {
      setSelectedCountry(`${objCountry.name}-${objCountry.isoCode}`);
      showLoading(theme, true);
      await Promise.all([
        GetPropertyByState(`${objCountry.name}-${objCountry.isoCode}`),
      ])
        .then((res) => {
          setPropertyListbyState(res[0]);
        })
        .catch((err) => {
          showMessage(err, theme, () => {});
        })
        .finally(() => {
          showLoading(theme, false);
        });
    }
  };

  return (
    <Page title="Dashboard">
      <RootStyle>
        <ScrollbarWrapper>
          <ContentWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12} xl={3} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                    backgroundColor: theme.palette.color.info.lighter,
                  }}
                >
                  <FlextAlignCenter sx={{ height: "100%" }}>
                    <Column>
                      <SubTitle
                        sx={{
                          color: theme.palette.color.info.main,
                          fontWeight: 700,
                        }}
                      >
                        Total Bookings
                      </SubTitle>
                      <Header>{AnalyticData.TotalBookings}</Header>
                    </Column>
                    <OverviewMatrixIconWrapper>
                      <Img
                        src={AnalyticlsImgs.BookingIconUrl}
                        alt="total Bookin Img"
                      />
                    </OverviewMatrixIconWrapper>
                  </FlextAlignCenter>
                </OverViewCard>
              </Grid>

              <Grid item xs={12} xl={3} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.secondary.main,
                    border: `1px solid ${theme.palette.border}`,
                    backgroundColor: theme.palette.color.success.lighter,
                  }}
                >
                  <FlextAlignCenter sx={{ height: "100%" }}>
                    <Column>
                      <SubTitle
                        sx={{
                          color: theme.palette.color.success.main,
                          fontWeight: 700,
                        }}
                      >
                        Total Revenue
                      </SubTitle>
                      <Header>{AnalyticData.TotalRevenue}</Header>
                    </Column>
                    <OverviewMatrixIconWrapper>
                      <Img
                        src={AnalyticlsImgs.RevenueIconUrl}
                        alt="total Bookin Img"
                      />
                    </OverviewMatrixIconWrapper>
                  </FlextAlignCenter>
                </OverViewCard>
              </Grid>

              <Grid item xs={12} xl={3} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.color.purple.darker,
                    border: `1px solid ${theme.palette.border}`,
                    backgroundColor: theme.palette.color.purple.lighter,
                  }}
                >
                  <FlextAlignCenter sx={{ height: "100%" }}>
                    <Column>
                      <SubTitle
                        sx={{
                          color: theme.palette.color.purple.darker,
                          fontWeight: 700,
                        }}
                      >
                        Total Properties
                      </SubTitle>
                      <Header>
                        {AnalyticData.TotalPropertyandRooms.property}
                      </Header>
                    </Column>
                    <OverviewMatrixIconWrapper>
                      <Img
                        src={AnalyticlsImgs.TotalPropertyIconUrl}
                        alt="total Bookin Img"
                      />
                    </OverviewMatrixIconWrapper>
                  </FlextAlignCenter>
                </OverViewCard>
              </Grid>

              <Grid item xs={12} xl={3} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.color.warning.darker,
                    border: `1px solid ${theme.palette.border}`,
                    backgroundColor: theme.palette.color.warning.lighter,
                  }}
                >
                  <FlextAlignCenter sx={{ height: "100%" }}>
                    <Column>
                      <SubTitle
                        sx={{
                          color: theme.palette.color.warning.darker,
                          fontWeight: 700,
                        }}
                      >
                        Total Rooms
                      </SubTitle>
                      <Header>{AnalyticData.TotalPropertyandRooms.room}</Header>
                    </Column>
                    <OverviewMatrixIconWrapper>
                      <Img
                        src={AnalyticlsImgs.RevenueIconUrl}
                        alt="total Bookin Img"
                      />
                    </OverviewMatrixIconWrapper>
                  </FlextAlignCenter>
                </OverViewCard>
              </Grid>

              {/* ---------------------------- row 2------------------------------------------------ */}

              {/* BookingAnalytics */}
              <Grid item xs={12} xl={6} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                  }}
                >
                  <FlextAlignCenter sx={{ justifyContent: "space-between" }}>
                    <Header>Bookings per Month</Header>
                    <CountryWrapper>
                      {AnalyticData.BookingAnalytics.length > 0 && (
                        <Text sx={{ color: theme.palette.color.info.darker }}>
                          {AnalyticData.BookingAnalytics[0].year}
                        </Text>
                      )}
                    </CountryWrapper>
                  </FlextAlignCenter>

                  <BarChart
                    dataset={AnalyticData.BookingAnalytics as any}
                    sx={{ width: "100%" }}
                    height={300}
                    series={[
                      {
                        data: AnalyticData.BookingAnalytics.map(
                          (objBook) => objBook.bookingCount
                        ),
                        color: theme.palette.color.info.lighter,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "monthName",
                      },
                    ]}
                  />
                </OverViewCard>
              </Grid>

              {/* RevenueAnalytics */}
              <Grid item xs={12} xl={6} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                  }}
                >
                  <FlextAlignCenter sx={{ justifyContent: "space-between" }}>
                    <Header>Revenue Generated per month</Header>
                    <CountryWrapper>
                      {AnalyticData.RevenueAnalytics.length > 0 && (
                        <Text
                          sx={{ color: theme.palette.color.success.darker }}
                        >
                          {AnalyticData.RevenueAnalytics[0].year}
                        </Text>
                      )}
                    </CountryWrapper>
                  </FlextAlignCenter>

                  <BarChart
                    dataset={AnalyticData.RevenueAnalytics as any}
                    sx={{ width: "100%" }}
                    height={300}
                    series={[
                      {
                        data: AnalyticData.RevenueAnalytics.map(
                          (objBook) => objBook.totalPaySum
                        ),
                        color: theme.palette.color.success.lighter,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "monthName",
                        label:
                          AnalyticData.RevenueAnalytics.length > 0
                            ? AnalyticData.BookingAnalytics[0].currency
                            : "",
                      },
                    ]}
                  />
                </OverViewCard>
              </Grid>

              {/* ---------------------------- row 3------------------------------------------------ */}

              {/* PropertyProfitByMonth */}
              <Grid item xs={12} xl={12} md={12}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                  }}
                >
                  <FlextAlignCenter sx={{ justifyContent: "space-between" }}>
                    <Header>Property Profit per Month</Header>
                    <CountryWrapper>
                      <Text sx={{ color: theme.palette.color.warning.main }}>
                        2024
                      </Text>
                    </CountryWrapper>
                  </FlextAlignCenter>

                  <PropertyProfitWrapper>
                    <Grid container gap={1} width={"100%"}>
                      <Scrollbar sx={{ height: "100%", width: "100%" }}>
                        {PropertyProfit.length > 0 ? (
                          PropertyProfit.map((objProp) => (
                            <Grid
                              item
                              xs={12}
                              xl={12}
                              md={3}
                              key={objProp.propertyID}
                              marginTop={"10px"}
                            >
                              <OverViewCard
                                sx={{
                                  color: theme.palette.primary.main,
                                  border: `1px solid ${theme.palette.border}`,
                                  padding: "15px",
                                  backgroundColor:
                                    theme.palette.background.neutral,
                                }}
                              >
                                <FlextAlignCenter
                                  sx={{ justifyContent: "space-between" }}
                                >
                                  <Header
                                    sx={{
                                      fontSize: "0.9rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                  >
                                    <HotelIcon
                                      IconColor={
                                        theme.palette.color.warning.lighter
                                      }
                                    />

                                    {objProp.propertyName}
                                  </Header>

                                  <Header
                                    sx={{
                                      fontSize: "0.9rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      color: `${
                                        objProp.profitChanges[0].status ===
                                        "Increase"
                                          ? theme.palette.color.success.main
                                          : objProp.profitChanges[0].status ===
                                            "Decrease"
                                          ? theme.palette.color.error.main
                                          : objProp.profitChanges[0].status ===
                                            "Neutral"
                                          ? theme.palette.color.warning.main
                                          : ""
                                      }`,
                                    }}
                                  >
                                    {"% " +
                                      Math.round(
                                        Math.ceil(
                                          objProp.profitChanges[0].profitChange
                                        )
                                      )}
                                    {objProp.profitChanges[0].status ===
                                      "Increase" && (
                                      <ProfitIncreaseIcon
                                        IconColor={
                                          theme.palette.color.success.main
                                        }
                                      />
                                    )}
                                    {objProp.profitChanges[0].status ===
                                      "Decrease" && (
                                      <ProfitDecreaseIcon
                                        IconColor={
                                          theme.palette.color.error.main
                                        }
                                      />
                                    )}
                                    {objProp.profitChanges[0].status ===
                                      "Neutral" && (
                                      <HorizontalMenuIcon
                                        IconColor={
                                          theme.palette.color.warning.main
                                        }
                                      />
                                    )}
                                  </Header>
                                </FlextAlignCenter>

                                <PropertyMonthsWrapper>
                                  {objProp.months.map((objMonth) => (
                                    <PropertyMonthsCard key={objMonth.month}>
                                      <Text sx={{ textAlign: "center" }}>
                                        {objMonth.monthName}
                                      </Text>
                                      <Text
                                        sx={{
                                          textAlign: "center",
                                          color:
                                            theme.palette.color.warning.main,
                                        }}
                                      >
                                        {objMonth.currency} {objMonth.totalPay}
                                      </Text>
                                    </PropertyMonthsCard>
                                  ))}
                                </PropertyMonthsWrapper>
                              </OverViewCard>
                            </Grid>
                          ))
                        ) : (
                          <Text>No Booking done of a single property.</Text>
                        )}
                      </Scrollbar>
                    </Grid>
                  </PropertyProfitWrapper>
                </OverViewCard>
              </Grid>

              {/* ---------------------------- row 4------------------------------------------------ */}

              {/* TopPropertiesByBooking */}
              <Grid item xs={12} xl={5} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                  }}
                >
                  <FlextAlignCenter sx={{ justifyContent: "space-between" }}>
                    <Header>Top 5 Properties By Bookings</Header>
                  </FlextAlignCenter>

                  <PieChart
                    series={[
                      {
                        data: AnalyticData.TopPropertiesByBooking.map(
                          (obj) => ({
                            value: obj.count,
                            label: obj.name,
                          })
                        ),
                      },
                    ]}
                    width={400}
                    height={300}
                    margin={{ right: 200 }}
                    slotProps={{
                      legend: {
                        padding: -20,
                      },
                    }}
                  />
                </OverViewCard>
              </Grid>

              <Grid item xs={12} xl={7} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                  }}
                >
                  <FlextAlignCenter sx={{ justifyContent: "space-between" }}>
                    <Header>Total Properties By State</Header>
                    <CountryWrapper
                      onClick={(e) =>
                        setAnchorPointPropertyByState(e.currentTarget)
                      }
                    >
                      <span
                        className={getFlagClassName(
                          SelectedCountry.split("-")[1] as any
                        )}
                      />
                      <Text sx={{ color: theme.palette.color.rose.lighter }}>
                        {SelectedCountry.split("-")[0]}
                      </Text>
                    </CountryWrapper>
                  </FlextAlignCenter>

                  <BarChart
                    dataset={propertListbyState as any}
                    sx={{ width: "100%" }}
                    height={300}
                    series={[
                      {
                        data: propertListbyState.map(
                          (objData) => objData.count
                        ),
                        color: theme.palette.color.rose.lighter,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "state",
                      },
                    ]}
                  />
                </OverViewCard>
              </Grid>

              {/* ---------------------------- row 4------------------------------------------------ */}
              {/* AllPropertyWithAvgReview */}
              <Grid item xs={12} xl={12} md={6}>
                <OverViewCard
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.border}`,
                  }}
                >
                  <FlextAlignCenter sx={{ justifyContent: "space-between" }}>
                    <Header>Properties with Avg Ratings</Header>
                  </FlextAlignCenter>

                  <BarChart
                    dataset={AnalyticData.AllPropertyWithAvgReview as any}
                    sx={{ width: "100%" }}
                    height={300}
                    series={[
                      {
                        data: AnalyticData.AllPropertyWithAvgReview.map(
                          (objBook) => objBook.AvgReview
                        ),
                        color: theme.palette.color.purple.lighter,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "propertyName",
                      },
                    ]}
                  />
                </OverViewCard>
              </Grid>
            </Grid>
          </ContentWrapper>
        </ScrollbarWrapper>
      </RootStyle>

      <MUIMenu
        open={openCtxMenuPointOne}
        anchorEl={anchorPointPropertyByState}
        onClose={() => setAnchorPointPropertyByState(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ height: 350, maxHeight: 250 }}>
          <Scrollbar sx={{ width: 300 }}>
            {countryList.map((objCountry) => (
              <MenuItem
                key={objCountry.isoCode}
                onClick={() => onSelectCountry(objCountry)}
                sx={{
                  backgroundColor:
                    SelectedCountry.split("-")[1] === objCountry.isoCode
                      ? alpha(theme.themeColor, 0.5)
                      : "",
                }}
              >
                <MenuItemWrapper>
                  <ListItemIcon>
                    <span
                      className={getFlagClassName(objCountry.isoCode as any)}
                    />
                  </ListItemIcon>
                  <MenuList>{objCountry.name}</MenuList>
                </MenuItemWrapper>
              </MenuItem>
            ))}
          </Scrollbar>
        </Box>
      </MUIMenu>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
}));

const ScrollbarWrapper = styled(Scrollbar)(() => ({
  height: "100%",
  width: "100%",
}));

const ContentWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "0.5rem",
  padding: "0.7rem 1.2rem",
  height: "100%",
  width: "100%",
}));

const OverViewCard = styled(Box)(() => ({
  minHeight: 100,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "24px",
  overflow: "hidden",
  borderRadius: "10px",
  // justifyContent: "center",
}));

const FlextAlignCenter = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  // alignItems: "center",
  gap: "10px",
}));

const Column = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const Header = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: 600,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.87rem",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const OverviewMatrixIconWrapper = styled(Box)(() => ({
  height: "100%",
  width: 60,
  marginLeft: "auto",
}));

const Img = styled("img")(() => ({
  objectFit: "cover",
  height: "100%",
  width: "100%",
}));

const CountryWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: "0.4rem 0.7rem",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${theme.palette.border}`,
  cursor: "pointer",
  gap: "10px",
  borderRadius: "10px",
}));

const MenuItemWrapper = styled(Box)(() => ({
  display: "flex",
  // justifyContent: "center",
  width: "100%",
  alignItems: "center",
  // gap: "10px",
}));

const PropertyProfitWrapper = styled(Box)(() => ({
  maxHeight: 500,
  height: "auto",
  width: "100%",
  display: "flex",
}));

const PropertyMonthsWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  flexShrink: "initial",
  gap: "10px",
}));

const PropertyMonthsCard = styled(Box)(({ theme }) => ({
  width: 120,
  height: 80,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "10px",
  overflow: "hidden",
  borderRadius: "10px",
  border: `1px solid ${theme.palette.border}`,
  backgroundColor: theme.palette.background.default,
  // justifyContent: "center",
}));
