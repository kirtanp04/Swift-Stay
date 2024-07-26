import {
  Box,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import { IState, State } from "country-state-city";
import { useLayoutEffect, useState } from "react";
import { CloseIcon, LocationIcon } from "src/assets/iconify";
import showMessage from "src/util/ShowMessage";
import Scrollbar from "../Scrollbar";

type Props = {
  onClose: () => void;
  countryCode: string;
  onSelectState: (stateName: string) => void;
};

export default function SearchCityDialog({
  onClose,
  countryCode,
  onSelectState,
}: Props) {
  const [dense] = useState<boolean>(false);
  const [states, setState] = useState<IState[]>([]);
  const [searchState, setSearchState] = useState<string>("");
  const theme = useTheme();

  useLayoutEffect(() => {
    const allStates = State.getStatesOfCountry(countryCode);
    if (allStates.length > 0) {
      setState(allStates);
    } else {
      showMessage(
        "Invalid Country Input or not such states. Change your country selection.",
        theme,
        () => {}
      );
    }
  }, [countryCode, theme]);

  const onStateSelect = (stateName: string) => {
    onSelectState(stateName);
    onClose();
  };

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: 450,
          position: "relative",
          borderRadius: "5px !important",
        },
      }}
    >
      <TextField
        placeholder="Search by city name.."
        fullWidth
        sx={{ backgroundColor: "hsl(0deg 0% 0.78%)" }}
        value={searchState}
        onChange={(e) => setSearchState(e.target.value)}
      />
      <List
        dense={dense}
        sx={{ backgroundColor: "hsl(0deg 0% 0.78%)", height: 350 }}
      >
        <Scrollbar sx={{ height: "100%" }}>
          {states
            .filter((objState) =>
              objState.name
                .toLocaleLowerCase()
                .includes(searchState.toLocaleLowerCase())
            )
            .map((objState) => (
              <EListItem
                key={objState.isoCode}
                onClick={() => onStateSelect(objState.name)}
              >
                <ListItemIcon>
                  <LocationIcon
                    height={22}
                    width={22}
                    IconColor={theme.palette.text.secondary}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={objState.name}
                  // secondary={secondary ? 'Secondary text' : null}
                />
              </EListItem>
            ))}
        </Scrollbar>
      </List>

      <CloseButtonWrapper onClick={onClose}>
        <CloseIcon
          height={"100%"}
          width={"100%"}
          IconColor={theme.palette.text.primary}
        />
      </CloseButtonWrapper>
    </Dialog>
  );
}

const EListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.border}`,
  padding: "10px",
  "& .MuiTypography-root": {
    fontSize: "0.95rem",
  },
  margin: "5px 0px",
  cursor: "pointer",
  transition: "0.5s ease-in-out",
  backgroundColor: alpha(theme.palette.text.secondary, 0.48),
}));

const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  height: 20,
  width: 20,
  borderRadius: "50%",
  position: "absolute",
  top: 0,
  right: 0,
  backgroundColor: theme.palette.color.error.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  cursor: "pointer",
}));
