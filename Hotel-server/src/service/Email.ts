import { NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { HttpStatusCodes, UserResponse } from '../common';
import { SendResponseToUser } from '../middleware/UserResponse';
import { SecrtKey } from '../env';

interface TConstructor {
  ID?: string;
  EMAIL_AUTH_USER?: string;
  EMAIL_AUTH_PASS?: string;
}

export class Email {
  private EMAIL_AUTH_USER: string;
  private EMAIL_AUTH_PASS: string;
  private ID: string;
  private host: string;
  private port: number;
  private transporter: nodemailer.Transporter;

  public from: string = '';
  public to: string = '';
  public subject: string = '';
  public html: string = '';
  public text: string = '';

  constructor({ EMAIL_AUTH_USER, EMAIL_AUTH_PASS, ID }: TConstructor) {
    this.EMAIL_AUTH_USER = EMAIL_AUTH_USER || SecrtKey.NODEMAILER.EMAIL_AUTH_USER!;
    this.EMAIL_AUTH_PASS = EMAIL_AUTH_PASS || SecrtKey.NODEMAILER.EMAIL_AUTH_PASS!;
    this.ID = ID || '';
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

  public async sendEmail(onsuccess: () => void, callback: (err: string) => void) {
    try {

      const info = await this.transporter.sendMail({
        from: '"' + 'Swift Stay' + '"' + '<' + this.EMAIL_AUTH_USER + '>',
        to: this.to,
        subject: this.subject,
        text: this.text,
        html: this.html,
      });
      onsuccess()

    } catch (error: any) {
      callback('Email Server Error: ' + error.message)
    }
  }
}
