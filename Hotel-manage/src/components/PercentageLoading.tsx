import { Box, LinearProgress, styled } from "@mui/material";

type Props = {
  progress: number;
};

const PercentageLoading = ({ progress }: Props) => {
  return (
    <LoaderWrapper>
      <LinearProgress value={progress} />
    </LoaderWrapper>
  );
};
export default PercentageLoading;

const LoaderWrapper = styled(Box)(() => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
}));
