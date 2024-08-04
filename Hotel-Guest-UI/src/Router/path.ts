



const rootPath = '/'
export const Path = {
    root: rootPath,
    login: rootPath + 'signin',
    signup: rootPath + 'signup',
    PropertyListByState: {
        root: (countryName: string, stateName: string) => {
            const encodedCountryName = encodeURIComponent(countryName);
            const encodedStateName = encodeURIComponent(stateName);

            // Construct the URL
            return `${rootPath}${encodedCountryName}/${encodedStateName}`;
        }
    }
}
