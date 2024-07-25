export const baseUrlName: string = '/swiftstay'

// helmet
export const descriptionContent = 'Book the best hotels, resort, appartments and manymore all over India.'


// export const SocketIoBaseUrl = 'http://localhost:5000'

export const BackendBaseApi = 'http://localhost:8080' // main api for manager 


export const Param = {
    broker: {



        Auth: 'GuestAuthBroker',
        Property: 'GuestPropertyBroker',
        Room: 'GuestRoomBroker',

    },

    function: {

        register: 'CreateGuestAccount',
        login: 'GuestLogin',

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