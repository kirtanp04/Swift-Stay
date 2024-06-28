

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