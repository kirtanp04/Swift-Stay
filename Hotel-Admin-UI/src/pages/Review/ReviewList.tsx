import {
  Box,
  Button,
  Rating,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RefreshIcon } from "src/assets/iconify";
import GridHeader from "src/components/GridHeader";
import { MUIDataGrid } from "src/components/mui/MUIDataGrid";
import Page from "src/components/Page";
import { ReviewApi, ReviewInfo, TReviewApiRes } from "./DataObject";
import useAuth from "src/hooks/useAuth";
import showMessage from "src/util/ShowMessage";
import showLoading from "src/util/ShowLoading";
import Scrollbar from "src/components/Scrollbar";

export default function ReviewList() {
  const [ReviewList, setReviewList] = useState<TReviewApiRes[]>([]);
  const {
    user: {
      userInfo: { id },
    },
  } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    LoadAllReviewByAdmin();
  }, []);

  const LoadAllReviewByAdmin = () => {
    showLoading(theme, true);
    ReviewApi.getReviewListbyAdmin(
      id,
      (res) => {
        setReviewList(res);
        showLoading(theme, false);
      },
      (err) => {
        showLoading(theme, false);
        showMessage(err, theme, () => {});
      }
    );
  };
  return (
    <Page title="Review">
      <RootStyle>
        <GridHeader>
          <Button
            // onClick={getAllProperty}
            variant="outlined"
            sx={{
              minWidth: "auto",
              marginLeft: "1rem",
            }}
          >
            <RefreshIcon
              height={20}
              width={20}
              onClick={LoadAllReviewByAdmin}
            />
          </Button>
        </GridHeader>

        <MUIDataGrid
          density="compact"
          rowHeight={350}
          columnVisibilityModel={{
            _id: false,
          }}
          getRowId={(row) => row._id}
          rowSelection={false}
          hideFooter
          rows={ReviewList}
          columns={[
            {
              field: "Property",
              headerName: "Property ",
              width: 300,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text sx={{ fontSize: "1rem" }}>
                    {param.row.Property.name}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "avgRating",
              headerName: "Average rating",
              width: 200,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Rating
                    name="Rating"
                    value={Math.round(param.row.avgRating * 10) / 10}
                    precision={0.5}
                    readOnly
                  />
                </TextWrapper>
              ),
            },

            {
              field: "Total",
              headerName: "Total review",
              width: 100,
              renderCell: (param: any) => (
                <TextWrapper>
                  <Text sx={{ fontSize: "1rem" }}>
                    {param.row.reviewInfo.length}
                  </Text>
                </TextWrapper>
              ),
            },
            {
              field: "reviews",
              headerName: "Reviews",
              flex: 1,
              renderCell: (param: any) => (
                <Scrollbar sx={{ height: "100%", maxHeight: "100%" }}>
                  <ReviewinfoWrapper>
                    {param.row.reviewInfo.map(
                      (objRev: ReviewInfo, i: number) => (
                        <MessageWrapper key={i}>
                          <ReviewMessage>{objRev.message}</ReviewMessage>
                          <ReviewMessage
                            sx={{ fontSize: "0.7rem", marginLeft: "auto" }}
                          >
                            {objRev.createAt as any}
                          </ReviewMessage>
                        </MessageWrapper>
                      )
                    )}
                  </ReviewinfoWrapper>
                </Scrollbar>
              ),
            },
          ]}
        />
      </RootStyle>
    </Page>
  );
}

const RootStyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  gap: "1rem",
  paddingTop: "0.5rem",
  padding: "0.7rem 1.2rem",
}));

const TextWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0.4rem",
  overflow: "hidden",
  gap: "0.7rem",
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));

const ReviewinfoWrapper = styled("ul")(() => ({
  width: "100%",
  height: "100%",
  padding: "0.5rem",
  margin: 0,
  listStyleType: "none",
}));

const MessageWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "0.5rem 1rem",
  marginBottom: "0.6rem",
  backgroundColor: theme.palette.grey[50012],
}));

const ReviewMessage = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  marginBottom: "0.5rem",
  wordWrap: "break-word",
}));
