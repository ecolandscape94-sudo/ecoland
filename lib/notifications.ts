import nodemailer from 'nodemailer';
import type { Inquiry } from './models';
export async function notifyInquiry(inquiry: Inquiry): Promise<Inquiry['notification']> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM || !process.env.INQUIRY_NOTIFY_EMAIL) return 'unconfigured';
  try {
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 10000, socketTimeout: 15000 });
    await transport.sendMail({ from: process.env.SMTP_FROM, to: process.env.INQUIRY_NOTIFY_EMAIL, replyTo: inquiry.email, subject: `New Eco Landscapes inquiry: ${inquiry.service.replace(/[\r\n]/g, ' ')}`, text: [`Reference: ${inquiry.id}`, `Name: ${inquiry.name}`, `Email: ${inquiry.email}`, `Telephone: ${inquiry.phone}`, `Service: ${inquiry.service}`, `Location: ${inquiry.location}`, `Size: ${inquiry.size || 'Not supplied'}`, '', inquiry.description, '', `${inquiry.attachments.length} attachment(s). Review securely in the staff dashboard.`].join('\n') });
    return 'sent';
  } catch { console.error('Inquiry email delivery failed', inquiry.id); return 'failed'; }
}
