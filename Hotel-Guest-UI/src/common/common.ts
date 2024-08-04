import { City } from "country-state-city";
import { countryNames } from "src/Types";

export function getFirstLetter(fullName: string) {
    let firstLetter = fullName.trim().charAt(0).toUpperCase();
    return firstLetter;
}

export function getAvatarColor(fullName: string): string {
    const firstLetter = getFirstLetter(fullName);

    const group1 = "ABCDEFGabcdefg0123!@#".split("");
    const group2 = "HIJKLMNhijklmn456$%^".split("");
    const group3 = "OPQRSTUVWXYZopqrstuvwxyz789&*()".split("");

    const colorGroup1 = "#365E32";
    const colorGroup2 = "#E7D37F";
    const colorGroup3 = "#FD9B63";

    if (group1.includes(firstLetter)) {
        return colorGroup1;
    } else if (group2.includes(firstLetter)) {
        return colorGroup2;
    } else if (group3.includes(firstLetter)) {
        return colorGroup3;
    } else {
        return "#81A263";
    }
}

export function isUndefinedOrNull(value: any, defaultValue: any) {
    try {
        if (value === undefined || value === null) {
            return defaultValue;
        } else {
            return value;
        }
    } catch (error) {
        return defaultValue;
    }
}

interface CountryFlag {
    name: string;
    className: string;
}

const countryFlags: CountryFlag[] = Object.keys(countryNames).map(
    (countryName) => {
        const countryCode = countryNames[countryName as keyof typeof countryNames];
        return {
            name: countryName,
            className: `fi fi-${countryCode.toLowerCase()}`,
        };
    }
);

export default countryFlags;

export const GetAllCityByCountryAndState = (
    countryCode: string,
    stateCode: string
): Promise<any> => {
    const Cities: Promise<any> = new Promise((resolve, reject) => {
        try {
            const allCities = City.getCitiesOfState(countryCode, stateCode);
            if (allCities.length > 0) {
                resolve(allCities);
            }

            return Cities;
        } catch (error: any) {
            reject(error.message);
        }
    });
    return Cities;
};
