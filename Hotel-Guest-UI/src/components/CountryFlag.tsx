import getFlagClassName from "src/util/getCountryFlagUrl";
import "/node_modules/flag-icons/css/flag-icons.min.css";
interface Props {
  countryCode: string;
}

export default function CountryFlag({ countryCode }: Props) {
  return <span className={getFlagClassName(countryCode as any)} />;
}
