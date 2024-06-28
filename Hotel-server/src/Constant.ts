export const Param = {
    broker: {
        manager: {
            Auth: 'ManagerAuthBroker',
            Property: 'ManagerPropertyBroker',
            Room: 'ManagerRoomBroker',
        },

        guest: {
            Auth: 'GuestAuthBroker',
            Property: 'GuestPropertyBroker',
            Room: 'GuestRoomBroker',
        },
    },

    function: {
        manager: {
            register: 'CreateManagerAccount',
            login: 'ManagerLogin',
            Property: {
                AddProperty: 'ManagerAddProperty',
                GetSingleProperty: 'ManagerGetSingleProperty',
                GetAllProperty: 'ManagerGetAllProperty',
            },
        },
        guest: {
            register: 'CreateGuestAccount',
            login: 'GuestLogin',
        },
    },
};
