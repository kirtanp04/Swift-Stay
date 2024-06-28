export enum enumUserRole {
    guest = 'guest',

    admin = 'admin'
}

export class Login {
    email: string = ''

    password: string = ''
}

export class Register {
    _id?: string = '';
    name: string = '';
    email: string = '';
    password: string = '';
    profileImg: string = '';
    phone: string = '';
    role: enumUserRole = enumUserRole.guest;
    createdAt: Date = new Date();
}