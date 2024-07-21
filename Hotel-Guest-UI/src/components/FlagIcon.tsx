import { CountryName, countryNames } from "src/Types";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface Props {
  countryName: CountryName;
}

const FlagIcon = ({ countryName }: Props) => {
  const countryCode: string = countryNames[countryName];
  if (!countryCode) {
    console.error(`Country code for ${countryName} not found.`);
    return "";
  }
  return <span className={`fi fi-${countryCode.toLowerCase()}`} />;
};

export default FlagIcon;
