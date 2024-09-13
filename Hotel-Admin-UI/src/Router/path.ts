export const CommonPath = {
    login: "/",
    signUp: "/register",
    aboutus: "/about",
    contact: "/contact-us",
};

const rootPath = "/swiftstay";

export const Path = {
    dashboard: rootPath + "/dashboard",
    property: {
        root: rootPath + "/properties",
        singleProperty: (propertyID: any) => rootPath + `/properties/${propertyID}`,
    },
    room: {
        root: rootPath + "/rooms",
    },
    booking: {
        root: rootPath + "/bookings",
        BookingDetails: (userName: string, bookingID: string) => {
            const formattedUserName = formatName(userName);

            return `${Path.booking.root}/${formattedUserName}/bookingdetails/${bookingID}`;
        },
    },
    review: {
        root: rootPath + "/reviews",
    },
    chat: {
        root: rootPath + "/chats",
    },
    errorLogs: rootPath + "/errorlogs",
};

const formatName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9]/g, "-");
};
