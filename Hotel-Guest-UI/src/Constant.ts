export const baseUrlName: string = "/swiftstay";

// helmet
export const descriptionContent =
    "Book the best hotels, resort, appartments and manymore all over India.";

export const ChatSocketIoBaseUrl = 'http://localhost:5001'

export const BackendBaseApi = "http://localhost:8080"; // main api for manager

export const Param = {
    broker: {

        Auth: 'GuestAuthBroker',
        Property: 'GuestPropertyBroker',
        Room: 'GuestRoomBroker',
        Job: 'GuestJobBroker',
        chat: 'GuestChatBroker',
        payment: 'GuestPaymentBroker',
        booking: 'GuestBookingBroker'
    },

    function: {
        register: 'CreateGuestAccount',
        login: 'GuestLogin',
        property: {
            GetAllPropertyByState: 'GuestGetAllPropertyByState',
            GetAllPropertyByCountry: 'GuestGetAllPropertyByCountry',
            GetTotalPropertByCountry: 'GuestGetTotalPropertByCountry',
            GetTotalPropertyByType: 'GuestGetTotalPropertyByType',
            GetPropertyListByFilterSearch: 'GuestGetPropertyListByFilterSearch',
            GetSinglePropertyDetail: 'GuestGetSinglePropertyDetail',
            GetHomePagePropertyData: 'GuestGethomePagePropertyData',
        },

        chat: {
            saveChat: 'GuestSaveChatService',
            initRedisForChat: 'InitRedisForChat'
        },
        room: {
            GetRoomDetail: 'GuestGetRoomDetail'
        },
        payment: {
            CheckOut: 'GuestCheckOut',
            WebHook: 'GuestWebhook',
            UPIPayment: "GuestUPIMethod",
        },
        booking: {
            SaveBookingInfo: 'GuestSaveBookingInfo',
            UpdateBookingInfo: 'GuestUpdateBookinInfo',
            generateInvoice: 'GuestGenerateInvoice',
            getMyBookingList: 'GuestGetMyBookingList'
        },
        job: {
            GetAllJobByProperty: 'GuestGetAllJobByProperty',
            GetJobDetail: 'GuestGetJobDetail',
        }
    },
};

export const SocketKeyName = {
    JoinRoom: "Join_room",
    SendMessage: "Send_Message",
    ReceiveMessage: "Receive_Message",
    ReceiveError: "Receive_Error",
    onJoinRoom: "roomJoined",
    TypingMessage: "TypingMessage",
    UserIsTyping: "UserIsTyping",
};


