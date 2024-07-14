export const Param = {
    broker: {
        manager: {
            Auth: 'ManagerAuthBroker',
            Property: 'ManagerPropertyBroker',
            Room: 'ManagerRoomBroker',
            chat: 'ManagerChatBroker'
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
                DeleteProperty: 'ManagerDeleteProperty',
                UpdateProperty: 'ManagerUpdateProperty'
            },
            Room: {
                AddRoom: 'ManagerAddRoom',
                UpdateRoom: 'ManagerUpdateRoom',
                DeleteRoom: 'ManagerDeleteRoom',
                GetAllRoom: 'ManagerGetAllRoom'
            },
            chat: {
                Init: 'ManagetChatInit'
            }
        },
        guest: {
            register: 'CreateGuestAccount',
            login: 'GuestLogin',
        },
    },
};


export const CacheKey = {
    user: {
        property: '#@User#@Property#@',
        room: '#@User#@Room#@',
    },
    manager: {
        property: (emailID: string) => `#@Manager#@${emailID}#@Property#@`,
        room: (emailID: string) => `#@Manager#@${emailID}#@Room#@`,
    }

}
