import { CountryCode } from "src/Types";


const getFlagClassName = (countryCode: CountryCode): string => {
    return `fi fi-${countryCode.toLowerCase()}`;
};

export default getFlagClassName;
