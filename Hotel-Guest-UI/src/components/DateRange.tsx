import { useTheme } from "@mui/material";
import { DateRange as DateRangePicker, DateRangeProps } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Props extends DateRangeProps {
  startingDate: Date;
  endingDate: Date;
}

export default function DateRange({
  endingDate,
  startingDate,
  ...other
}: Props) {
  const theme = useTheme();
  return (
    // <DateRangePicker
    //   ranges={[
    //     {
    //       autoFocus: true,
    //       color: theme.palette.text.primary,
    //       startDate: startingDate,
    //       endDate: endingDate,
    //       showDateDisplay: true,
    //     },
    //   ]}
    //   rangeColors={[theme.themeColor]}
    //   {...other}
    // />

    <DateRangePicker
      editableDateInputs
      moveRangeOnFirstSelection={false}
      ranges={[
        {
          //   autoFocus: true,
          //   color: theme.palette.text.primary,
          startDate: new Date(),
          endDate: new Date(),
          showDateDisplay: true,
          key: "data-range",
        },
      ]}
      className="date"
      minDate={new Date()}
      {...other}
    />
  );
}
