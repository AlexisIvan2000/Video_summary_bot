import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

export async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
       host: ENV.EMAIL_HOST,
       port: ENV.EMAIL_PORT,
       secure: false,
       auth:{
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
       },
       tls:{ rejectUnauthorized: false }
    });
    await transporter.sendMail({
        from:`"@Alexan2000Bot" <${ENV.GMAIL_USER}>`,
        to,
        subject,
        text,
    })
    
}