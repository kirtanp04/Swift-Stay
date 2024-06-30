"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKey = exports.Param = void 0;
exports.Param = {
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
exports.CacheKey = {
    property: '#@Property@#',
    room: '#@Room@#',
};
