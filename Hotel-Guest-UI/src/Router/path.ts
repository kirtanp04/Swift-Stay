



const rootPath = '/'
export const Path = {
    root: rootPath,
    login: rootPath + 'signin',
    signup: rootPath + 'signup',
    proprty: {
        formatName: (name: string) => {
            return name.replace(/[^a-zA-Z0-9]/g, '-');
        },

        PropertyListByState: (countryName: string, stateName: string) => {
            const formattedCountryName = Path.proprty.formatName(countryName);
            const formattedStateName = Path.proprty.formatName(stateName);
            return `${rootPath}${formattedCountryName}/${formattedStateName}`;
        },

        PropertyDetail: (countryName: string, stateName: string, propertyName: string, propertyID: string) => {
            const formattedCountryName = Path.proprty.formatName(countryName);
            const formattedStateName = Path.proprty.formatName(stateName);
            const formattedPropertyName = Path.proprty.formatName(propertyName);
            return `${rootPath}${formattedCountryName}/${formattedStateName}/${formattedPropertyName}/${propertyID}`;
        }
    },
    booking: (countryName: string, stateName: string, propertyName: string, propertyID: string, roomID: string, roomType: string) => {
        const formattedCountryName = Path.proprty.formatName(countryName);
        const formattedStateName = Path.proprty.formatName(stateName);
        const formattedPropertyName = Path.proprty.formatName(propertyName);
        const formattedRoomType = Path.proprty.formatName(roomType);
        return `${rootPath}${formattedCountryName}/${formattedStateName}/${formattedPropertyName}/${propertyID}/booking/${formattedRoomType}/${roomID}`;
    }
};

