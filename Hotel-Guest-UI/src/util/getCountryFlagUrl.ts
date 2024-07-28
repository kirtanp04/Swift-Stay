import { CountryName } from "src/Types";


const getFlagClassName = (countryCode: CountryName): string => {
    return `fi fi-${countryCode.toLowerCase()}`;
};

export default getFlagClassName;
