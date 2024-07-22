import { countryNames } from "./Types";

export const baseUrlName: string = '/'

// helmet
export const descriptionContent = 'Book the best hotels, resort, appartments and manymore all over India.'


export const SocketIoBaseUrl = 'http://localhost:5000' // Admin socket io

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
            EmailVerification: 'ManagerEmailVerification',
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
    },
};




export const SocketKeyName = {
    JoinRoom: 'Join_room',
    SendMessage: 'Send_Message',
    ReceiveMessage: 'Receive_Message',
    ReceiveError: 'Receive_Error',
    onJoinRoom: 'roomJoined',
    TypingMessage: 'TypingMessage',
    UserIsTyping: 'UserIsTyping'
}


export const countryNamesArray = Object.entries(countryNames).map(([name, code]) => ({ name, code }));

// Example output:
// [
//   { name: 'Afghanistan', code: 'AF' },
//   { name: 'Albania', code: 'AL' },
//   // ... other countries
// ]
