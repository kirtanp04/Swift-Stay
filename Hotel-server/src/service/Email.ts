// import { NextFunction } from 'express'
// import nodemailer from 'nodemailer'
// import { HttpStatusCodes, UserResponse } from '../common'
// import { SendResponseToUser } from '../middleware/UserResponse'
// import { SecrtKey } from '../env'

// interface TConstructor {
//   ID?: string

//   EMAIL_AUTH_USER?: string

//   EMAIL_AUTH_PASS?: string

//   host?: string

//   port?: 587 | 465

//   next: NextFunction

// }

// export class Email {

//   private EMAIL_AUTH_USER: string = SecrtKey.NODEMAILER.EMAIL_AUTH_USER!

//   private EMAIL_AUTH_PASS: string = SecrtKey.NODEMAILER.EMAIL_AUTH_PASS!

//   private ID: string = '' // For admin verification...

//   private host: string = SecrtKey.NODEMAILER.EMAIL_HOST!

//   private port: number = 587

//   private next: NextFunction | null = null

//   private Transporter: nodemailer.Transporter | null = null

//   public from: string = ''

//   public to: string = ''

//   public subject: string = ''

//   public html: string = ''

//   public text: string = ''

//   constructor({ EMAIL_AUTH_USER, EMAIL_AUTH_PASS, ID, next }: TConstructor) {
//     this.EMAIL_AUTH_USER = EMAIL_AUTH_USER!
//     this.EMAIL_AUTH_PASS = EMAIL_AUTH_PASS!
//     this.ID = ID!
//     this.next = next

//     const Transporter = this.CreateTransport()
//     this.Transporter = Transporter
//   }

//   private CreateTransport(): nodemailer.Transporter {

//     const Transporter = nodemailer.createTransport({

//       host: this.host,
//       port: this.port,
//       secure: this.port === 465,
//       auth: {
//         user: this.EMAIL_AUTH_USER,
//         pass: this.EMAIL_AUTH_PASS
//       },
//       service: "gmail",
//     })

//     return Transporter

//   }

//   public SendEmail() {
//     try {

//       this.Transporter?.sendMail({
//         from: this.from,
//         to: this.to,
//         subject: this.subject,
//         text: this.text,
//         html: this.html
//       }, (err: Error | null, info: any) => {
//         let _userRes = new UserResponse()
//         if (err) {
//           _userRes.Message = err.message
//           _userRes.isError = true
//           _userRes.statusCode = HttpStatusCodes.BAD_GATEWAY
//           console.log(_userRes)
//           SendResponseToUser(_userRes, this.next!)
//         }
//       })

//     } catch (error: any) {
//       let _userRes = new UserResponse()
//       _userRes.Message = error.message
//       _userRes.isError = true
//       _userRes.statusCode = HttpStatusCodes.BAD_GATEWAY
//       console.log("try", _userRes)
//       SendResponseToUser(_userRes, this.next!)

//     }
//   }
// }

// `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <div style="text-align: center; margin-bottom: 20px;">
//         <img src="https://example.com/path/to/company-logo.png" alt="Company Logo" style="max-width: 150px;">
//       </div>
//       <h1 style="color: #4CAF50;">Welcome to Our Service!</h1>
//       <p style="font-size: 16px; color: #555;">Hello,</p>
//       <p style="font-size: 16px; color: #555;">
//         We're excited to have you on board. Here's a summary of what you can expect from our service:
//       </p>
//       <ul style="list-style-type: none; padding: 0;">
//         <li style="background-color: #f9f9f9; margin: 10px 0; padding: 10px; border-radius: 5px;">
//           <strong>Feature 1:</strong> Description of feature 1.
//         </li>
//         <li style="background-color: #f9f9f9; margin: 10px 0; padding: 10px; border-radius: 5px;">
//           <strong>Feature 2:</strong> Description of feature 2.
//         </li>
//         <li style="background-color: #f9f9f9; margin: 10px 0; padding: 10px; border-radius: 5px;">
//           <strong>Feature 3:</strong> Description of feature 3.
//         </li>
//       </ul>
//       <p style="font-size: 16px; color: #555;">
//         If you have any questions, feel free to <a href="mailto:support@example.com" style="color: #4CAF50;">contact us</a>.
//       </p>
//       <div style="text-align: center; margin: 20px 0;">
//         <a href="https://frontend.example.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
//           Visit Our Website
//         </a>
//       </div>
//       <p style="font-size: 16px; color: #555;">Best regards,<br/>The Team</p>
//     </div>
//   `



import { NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { HttpStatusCodes, UserResponse } from '../common';
import { SendResponseToUser } from '../middleware/UserResponse';
import { SecrtKey } from '../env';

interface TConstructor {
  ID?: string;
  EMAIL_AUTH_USER?: string;
  EMAIL_AUTH_PASS?: string;
  next: NextFunction;
}

export class Email {
  private EMAIL_AUTH_USER: string;
  private EMAIL_AUTH_PASS: string;
  private ID: string;
  private host: string;
  private port: number;
  private next: NextFunction | null;
  private transporter: nodemailer.Transporter;

  public from: string = '';
  public to: string = '';
  public subject: string = '';
  public html: string = '';
  public text: string = '';

  constructor({ EMAIL_AUTH_USER, EMAIL_AUTH_PASS, ID, next }: TConstructor) {
    this.EMAIL_AUTH_USER = EMAIL_AUTH_USER || SecrtKey.NODEMAILER.EMAIL_AUTH_USER!;
    this.EMAIL_AUTH_PASS = EMAIL_AUTH_PASS || SecrtKey.NODEMAILER.EMAIL_AUTH_PASS!;
    this.ID = ID || '';
    this.next = next;
    this.host = SecrtKey.NODEMAILER.EMAIL_HOST!;
    this.port = 587;
    this.transporter = this.createTransport();
  }

  private createTransport(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.port === 465,
      auth: {
        user: this.EMAIL_AUTH_USER,
        pass: this.EMAIL_AUTH_PASS,
      },
      service: 'gmail',
    });
  }

  public async sendEmail() {
    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: this.to,
        subject: this.subject,
        text: this.text,
        html: this.html,
      });

    } catch (error: any) {
      let userRes = new UserResponse();
      userRes.Message = error.message;
      userRes.isError = true;
      userRes.statusCode = HttpStatusCodes.BAD_GATEWAY;
      console.log(userRes);
      SendResponseToUser(userRes, this.next!);
    }
  }
}
