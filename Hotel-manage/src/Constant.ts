export const baseUrlName: string = '/'

// helmet
export const descriptionContent = 'Book the best hotels, resort, appartments and manymore all over India.'





export const Param = {

    broker: {

        manager: {
            Auth: 'ManagerAuthBroker',
            Property: 'ManagerPropertyBroker',
            Room: 'ManagerRoomBroker'
        },

        guest: {

            Auth: 'GuestAuthBroker',
            Property: 'GuestPropertyBroker',
            Room: 'GuestRoomBroker'

        }

    },

    function: {
        manager: {
            register: 'CreateManagerAccount',
            login: 'ManagerLogin'
        },
        guest: {
            register: 'CreateGuestAccount',
            login: 'GuestLogin'
        }
    }
}