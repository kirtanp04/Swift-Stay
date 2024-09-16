import { Api, getGETParamData } from "src/common/ApiCall";
import { Param } from "src/Constant";
import { StoreError } from "src/util/StoreError";

// -------------------------------- Analytic

export interface TBookingAnalytics {
    bookingCount: number
    year: number
    monthName: string
    currency: string
}

export interface TRevenueAnalytics {
    totalPaySum: number
    year: number
    currency: string
    monthName: string
}


export interface TToppropertyByBooking {
    count: number
    name: string
}

export interface TTotalpropertyAndRoom {
    property: number
    room: number
}

export interface TAllPropertyWithAvgReview {
    propertyName: string
    AvgReview: number
}

export interface TAllPropertyByState {
    count: number
    state: string
}

interface TProfitMonth {
    month: number
    year: number
    totalPay: number
    monthName: string
    currency: string
}

interface TProfitChange {
    profitChange: number
    status: "Increase" | "Decrease" | "Neutral"
}

export interface TPropertyProfitByMonth {
    propertyID: string
    propertyName: string
    months: TProfitMonth[]
    profitChanges: TProfitChange[]
}



export class Analytic {
    TotalBookings: number = 0
    TotalRevenue: string = ''
    BookingAnalytics: TBookingAnalytics[] = []
    RevenueAnalytics: TRevenueAnalytics[] = []
    TopPropertiesByBooking: TToppropertyByBooking[] = []
    TotalPropertyandRooms: TTotalpropertyAndRoom = {
        property: 0,
        room: 0
    }
    AllPropertyWithAvgReview: TAllPropertyWithAvgReview[] = []

    static GetOverviewMetrics = async (
        adminID: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.analytic,
                Param.function.manager.analytics.GetOverviewMetrics,
                adminID
            );

            await Api.protectedGet(_Param, (res) => {
                if (res.error === "") {
                    onsuccess(res.data);
                } else {
                    StoreError("Getting Dashboard Data", res.error);
                    onfail(res.error);
                }
            });
        } catch (error: any) {
            StoreError("Getting Dashboard Data", error.message);
            onfail(error.message);
        }
    };


    static GetPropertyByState = async (
        adminID: string,
        country: string,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.analytic,
                Param.function.manager.analytics.PropertybyStates,
                { adminID: adminID, country: country }
            );

            await Api.protectedGet(_Param, (res) => {
                if (res.error === "") {
                    onsuccess(res.data);
                } else {
                    StoreError("Dashboard: Getting Dashboard Data", res.error);
                    onfail(res.error);
                }
            });
        } catch (error: any) {
            StoreError("Dashboard: Getting Property by state", error.message);
            onfail(error.message);
        }
    };

    static GetPropertyProfitByMonth = async (
        adminID: string,
        year: number,
        onsuccess: (res: any) => void,
        onfail: (err: any) => void
    ) => {
        try {
            const _Param = getGETParamData(
                Param.broker.manager.analytic,
                Param.function.manager.analytics.GetPropertyProfitByMonth,
                { adminID: adminID, year: year }
            );

            await Api.protectedGet(_Param, (res) => {
                if (res.error === "") {
                    onsuccess(res.data);
                } else {
                    StoreError("Dashboard: Getting Dashboard Data", res.error);
                    onfail(res.error);
                }
            });
        } catch (error: any) {
            StoreError("Dashboard: Getting Property by state", error.message);
            onfail(error.message);
        }
    };
}





export const AnalyticlsImgs = {
    BookingIconUrl: 'data:image/png;base64,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',
    RevenueIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD80lEQVR4nO2WW0ybZRjHG701Gm+98N5rr7zz0nhPYnT0QMvEms2d2n49QBlstFAoZEhb9vXwFQqUwlrKYZSvrccsSCpbJDjNVGCJ6E2JA7a1gOnfPG9S02GoreVQlX/yJG/et+/3/L7n1E8iOdWpTvUfkNStRTWapBBQXEtWlUn/N4Ch5SgsogMXR9ug9BmY0doqOhFanjg5wNhKHG1zfVAHrmLibhwP0+vI7u0wW0uvsz11oBlWsQ+x1cTxAhIcF7ahJyEgs5vFQXq6m0F33Ad9xFY2ZEWAbXMOBpdDDn+nXC7HIKkMjgWQao7SWixy+/V0J8PSPbYcrRyQUtGRdEEdMLOH2hL9z6SHip/qq1yFF0VY466S/RwISD/siPHYePyIWfvsTbaXP6cOfbjxS9mAa+l1XBptK9nPgYD0NnQhr43Hv7G9/LlKMCCzu1M2YGY3C5VgLNlPBYDGsuqvsKPrBVPlgBRmCjddILNS6JP7UpxeR7laTf/8lxQX81O0Segyvc1BTRJZPJwmsRXxU8GYmWAPpJSVO2ZC3x7CmCnF6O+Lhm8uV9qgtoteWETn8QzqfHr0kU4GSdEpFjm76IMh0onYavz4APOQFtHBUkf1RU1A44c6nNa0R2cUuXLhDgUwb2PLUVb81KE0I8lo3R53llVzRwYoHpH9+wClVWiSQlVTFKX74QqjqBT0UPmNzM4OmKAeMuPcyFVcCF2DNtwOfdSGxkk7WmK9aBP70JFwoudzD5zzA/ClghheuoXwd9OY+VE8XMA8JH3OT/8QYxb5fpo5Cy5FMLIUhv9uCL6vg+AXhuCaH0TvlwK6PuVhjTvQMnsDpqkuaMNWnA+24v0BExQ+Dg2BJlwYbQUX6UDzTA86P+lnLzN4b5w9P7aSKA9Q5tHuKXz6bL3fuN0QaNz8cLh58/L49Uemqa4tS9yZvfGFFzcXhhC4N47x+5PFI7WaRPTBbfYVLiyOwnHHD1vSBfNMNy6PW9Aw2ASFl8NHwVY0Tdlh/4yHJzVyMCDpvcFzL77r4F6uc2teqeW1r9W6r7wh46+8JeV1Z6S85qLcretW+Y2R+gFjSinof5Xx2t8VXn32fLBls3Ha/oScuBeGcev+VEnpnF2JswxRVC1iH5SCATKPbkNyWDKbzc/V9utelfG6N2vdmjqFh+tRCYav5F5ui8AvjV3ftIh9e1QWkw9m/3n9HYXqWBY0b8s8XKNSMNyRe3XZDwLmrWux3l1vKojbP82dLOB+1YRqnpfx3Otyt85QL5hSci+X1YSt2675gT9hTxRwv2o+Nr9wxq19RyUYRYWPe2KIdm5XFWChzvbrXpK7ObXco/vmmYNTSSrTH4EFOh5n91pYAAAAAElFTkSuQmCC',
    TotalPropertyIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4UlEQVR4nGNgIBuU/O/jq/97g6H0/1UwXfJ/Iy6Fq2sPPvnPUPr/P5S+iiL/n4GB8aMYa4x7+La93gtfgxV6Q2iEwp+SXEZvlYRvn3G0/HbTQP3PPle//+I5L/7bT7iJqvCSruKVeVNn/194783/Odee/l9VVv6/xTn3f9dZNBPn336eK93+93/8lu//zWb8+u+y6Od/mdaf/436XqIqXPLoQ3bl3sf/+86//N945On/1uPP/8u0//0fvvAGqsL2vUedmrYenAbCWSvP7kxYcvG0aM7pmQwxJ/sZYs9UkBS+AGOmjS+rYjCPAAAAAElFTkSuQmCC'
}

