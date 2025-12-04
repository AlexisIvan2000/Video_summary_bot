import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

export async function sendEmail(to, summary) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENV.GMAIL_USER,
            pass: ENV.GMAIL_PASS
        }
    });
    await transporter.sendMail({
        from:`"@Alexan2000Bot" <${ENV.GMAIL_USER}>`,
        to: to,
        subject: 'Your Video Summary',
        text: summary
    })
    
}