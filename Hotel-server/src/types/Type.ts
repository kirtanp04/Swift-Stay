export class TParam {
    Broker: string = ''

    function: string = ''

    data: any
}

export class ChatObj {
    message: string = "";
    date: Date | string = new Date();
    key: string = "";
    senderDetail: Sender = new Sender();
}

class Sender {
    id: string = "";
    email: string = "";
    name: string = "";
    profileImg: string = "";
}