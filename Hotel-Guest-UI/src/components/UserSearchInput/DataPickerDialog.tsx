import { Box, Button, Dialog, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

type Props = {
  onClose: () => void;
  defaultStartDate: Date | null;
  defaultEndDate: Date | null;
  onSelectDateRange: (startDate: Date, endDate: Date) => void;
};

export default function DataPickerDialog({
  defaultStartDate,
  onClose,
  defaultEndDate,
  onSelectDateRange,
}: Props) {
  const [state, setState] = useState<any>([
    {
      startDate: defaultStartDate !== null ? defaultStartDate : new Date(),
      endDate: defaultEndDate !== null ? defaultEndDate : new Date(),
      key: "selection",
    },
  ]);

  const theme = useTheme();

  useEffect(() => {
    const changeSpanColor = () => {
      const staticRangeSpans = document.querySelectorAll(
        ".rdrStaticRangeLabel"
      );

      const RangeWrapper = document.querySelectorAll(
        ".rdrDefinedRangesWrapper "
      );
      staticRangeSpans.forEach((span: any) => {
        span.style.color = theme.palette.background.default;
        span.style.textTransform = "capitalize";
      });

      RangeWrapper.forEach((span: any) => {
        span.style.display = "none";
      });

      const inputRangeDivs = document.querySelectorAll(".rdrInputRanges");
      inputRangeDivs.forEach((div) => {
        const spans = div.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.color = theme.palette.background.default;
          span.style.textTransform = "capitalize";
        });
      });
    };

    changeSpanColor();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          changeSpanColor();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [theme]);
  const onChange = (item: any) => {
    setState([item.selection]);
    // console.log(item.selection);
    // onClose();
  };

  const onSave = () => {
    // console.log(state);
    onSelectDateRange(state[0].startDate, state[0].endDate);
    onClose();
  };

  return (
    <Dialog
      open={true}
      maxWidth="md"
      fullWidth
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "max-content !important",
          position: "relative",
        },
      }}
    >
      <DateRangePicker
        onChange={onChange}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        preventSnapRefocus={true}
        calendarFocus="backwards"
        rangeColors={[theme.palette.color.purple.main]}
        fixedHeight
        minDate={new Date()}
      />
      <ButtonWrapper>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.color.error.main,
            border: "0px solid transparent",
            "&:hover": {
              backgroundColor: theme.palette.color.error.main,
              border: "0px solid transparent",
            },
          }}
          onClick={onClose}
        >
          close
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.color.success.main,
            border: "0px solid transparent",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: theme.palette.color.success.main,
              border: "0px solid transparent",
            },
          }}
          onClick={onSave}
        >
          save
        </Button>
      </ButtonWrapper>
    </Dialog>
  );
}

const ButtonWrapper = styled(Box)(() => ({
  position: "absolute",
  bottom: "5px",
  left: "10px",
}));
