import { Box, styled, Theme, Typography } from "@mui/material";
import React from "react";

interface PrimaryButton {
  label: string;
  callback: () => void;
}

interface ToastMessageCardProps {
  theme: Theme;
  variant: "success" | "error" | "info" | "warning";
  title: string;
  description: string;
  customButton?: PrimaryButton;
}

export const ToastMessageCard: React.FC<ToastMessageCardProps> = ({
  theme,
  variant,
  title,
  description,
  customButton,
}) => {
  const titleStyle = {
    success: { color: theme.palette.color.success.main },
    error: { color: theme.palette.color.error.main },
    info: { color: theme.palette.color.info.main },
    warning: { color: theme.palette.color.warning.main },
  };

  const descriptionStyle = {
    color: theme.palette.text.secondary,
  };

  return (
    <RootStyle>
      <TitleDescWrapper>
        <Typography
          sx={titleStyle[variant]}
          fontSize={"1rem"}
          fontWeight={600}
          textTransform={"capitalize"}
        >
          {title}
        </Typography>
        <Typography sx={descriptionStyle} fontSize={"0.85rem"} fontWeight={500}>
          {description}
        </Typography>
      </TitleDescWrapper>
      {customButton && (
        <Button onClick={customButton.callback}>{customButton.label}</Button>
      )}
    </RootStyle>
  );
};

const RootStyle = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  //   border: `0.7px solid ${theme.palette.color[varient].lighter}`,
  padding: "10px",
  //   backgroundColor: theme.palette.background.neutral,
  borderRadius: "15px",
  alignItems: "center",
}));

const TitleDescWrapper = styled(Box)(() => ({
  display: "flex",
  gap: "5px",
  flexDirection: "column",
}));

const Button = styled("button")(({ theme }) => ({
  minWidth: 80,
  textAlign: "center",
  backgroundColor: theme.palette.background.neutral,
  color: theme.palette.text.primary,
  height: 40,
  border: `0px solid transparent`,
  borderRadius: "10px",
  cursor: "pointer",
}));
