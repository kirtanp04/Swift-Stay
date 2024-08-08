



const rootPath = '/'
export const Path = {
    root: rootPath,
    login: rootPath + 'signin',
    signup: rootPath + 'signup',
    proprty: {
        PropertyListByState: (countryName: string, stateName: string) => {
            const encodedCountryName = encodeURI(countryName);
            const encodedStateName = encodeURI(stateName);
            return `${rootPath}${encodedCountryName}/${encodedStateName}`;
        },
        PropertyDetail: (countryName: string, stateName: string, propertyName: string, propertyID: string) => {
            const encodedCountryName = encodeURI(countryName);
            const encodedStateName = encodeURI(stateName);
            const encodedPropertyName = encodeURI(propertyName);
            const encodedPropertyID = encodeURI(propertyID);
            return `${rootPath}${encodedCountryName}/${encodedStateName}/${encodedPropertyName}/${encodedPropertyID}`;
        }
    }

}
