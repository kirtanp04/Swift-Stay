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
    role: 'guest' | 'admin' = 'admin';
    createdAt: Date = new Date();
}