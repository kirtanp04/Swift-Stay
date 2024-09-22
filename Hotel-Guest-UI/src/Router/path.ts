



const rootPath = '/'
export const Path = {
    root: rootPath,
    login: rootPath + 'signin',
    signup: rootPath + 'signup',
    formatName: (name: string): string => {
        return name.replace(/[^a-zA-Z0-9]/g, '-');
    },
    proprty: {


        PropertyListByState: (countryName: string, stateName: string): string => {
            const formattedCountryName = Path.formatName(countryName);
            const formattedStateName = Path.formatName(stateName);
            return `${rootPath}${formattedCountryName}/${formattedStateName}`;
        },

        PropertyDetail: (countryName: string, stateName: string, propertyName: string, propertyID: string): string => {
            const formattedCountryName = Path.formatName(countryName);
            const formattedStateName = Path.formatName(stateName);
            const formattedPropertyName = Path.formatName(propertyName);
            return `${rootPath}${formattedCountryName}/${formattedStateName}/${formattedPropertyName}/${propertyID}`;
        }
    },
    booking: {
        bookingForm: (countryName: string, stateName: string, propertyName: string, propertyID: string, roomID: string, roomType: string): string => {
            const formattedCountryName = Path.formatName(countryName);
            const formattedStateName = Path.formatName(stateName);
            const formattedPropertyName = Path.formatName(propertyName);
            const formattedRoomType = Path.formatName(roomType);
            return `${rootPath}${formattedCountryName}/${formattedStateName}/${formattedPropertyName}/${propertyID}/booking/${formattedRoomType}/${roomID}`;
        },

        bookingList: rootPath + 'mybooking'
    },

    job: {
        jobDetail: (countryName: string, stateName: string, propertyName: string, propertyID: string): string => {
            const formattedCountryName = Path.formatName(countryName);
            const formattedStateName = Path.formatName(stateName);
            const formattedPropertyName = Path.formatName(propertyName);
            return `${rootPath}${formattedCountryName}/${formattedStateName}/${formattedPropertyName}/${propertyID}/job-detail`;
        }
    }


};

