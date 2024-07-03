import React from "react";
import { Box, BoxProps, Skeleton } from "@mui/material";

interface LoadingSkeletonProps extends BoxProps {
  isLoading: boolean;
  children: React.ReactNode;
  variant?: "text" | "circular" | "rectangular" | "rounded";
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  isLoading,
  children,
  variant = "text",
  ...other
}) => {
  return (
    <Box {...other}>
      {isLoading ? (
        <Skeleton
          variant={variant}
          width={"100%"}
          height={"100%"}
          animation="wave"
        />
      ) : (
        children
      )}
    </Box>
  );
};

export default LoadingSkeleton;
