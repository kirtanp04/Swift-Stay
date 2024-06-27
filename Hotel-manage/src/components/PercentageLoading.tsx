import { Box, LinearProgress, styled } from "@mui/material";

type Props = {
  progress: number;
};

export default function PercentageLoading({ progress }: Props) {
  return (
    <LoaderWrapper>
      <LinearProgress value={progress} />
    </LoaderWrapper>
  );
}

const LoaderWrapper = styled(Box)(() => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
}));
