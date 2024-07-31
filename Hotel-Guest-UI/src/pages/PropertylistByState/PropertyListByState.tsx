import { Box, styled } from "@mui/material";
import Page from "src/components/Page";
import useUserSearch from "src/hooks/useUserSearch";
import Filter from "./components/Filter";

type Props = {};

export default function PropertyListByState({}: Props) {
  const {
    UserSearchObj: { selectedState },
  } = useUserSearch();
  return (
    <Page title={selectedState}>
      <Rootstyle>
        <Filter />
      </Rootstyle>
    </Page>
  );
}

const Rootstyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  // backgroundColor: "red",
}));
