import { alpha, styled } from "@mui/material";
import { MenuProps } from "@mui/material";
import { Menu } from "@mui/material";

export const MUIMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "center",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiMenu-paper": {
    minWidth: 90,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiMenuItem-root": {
    fontSize: "0.75rem",
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: "center",
    "& .MuiSvgIcon-root": {
      fontSize: 18,
      color: theme.palette.text.secondary,
      marginRight: "9px",
    },
    "&:active": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
    },
  },
  "& .MuiList-root": {
    paddingTop: 0,
    paddingBottom: 0,
  },
  "& .MuiListItemIcon-root": {
    minWidth: "auto !important",
  },
}));
