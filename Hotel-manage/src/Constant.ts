export const baseUrlName: string = '/'

// helmet
export const descriptionContent = 'Book the best hotels, resort, appartments and manymore all over India.'


export const SocketIoBaseUrl = 'http://localhost:5050'

export const BackendBaseApi = 'http://localhost:8080' // main api for manager 


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