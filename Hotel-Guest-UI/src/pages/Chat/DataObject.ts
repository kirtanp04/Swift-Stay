export class ChatObj {
    message: string = ''

    date: Date = new Date()

    key: string = ''

    senderDetail: Sender = new Sender()
}

class Sender {
    _id: string = ''

    email: string = ''

    name: string = ''

    profileImg: string = ''
}