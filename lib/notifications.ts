import { Resend } from 'resend';
import type { Inquiry } from './models';

export async function notifyInquiry(inquiry: Inquiry): Promise<Inquiry['notification']> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !recipient) return 'unconfigured';

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: recipient,
      replyTo: inquiry.email,
      subject: `New Eco Landscapes inquiry: ${inquiry.service.replace(/[\r\n]/g, ' ')}`,
      text: [
        `Reference: ${inquiry.id}`,
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Telephone: ${inquiry.phone}`,
        `Service: ${inquiry.service}`,
        `Location: ${inquiry.location}`,
        `Size: ${inquiry.size || 'Not supplied'}`,
        '',
        inquiry.description,
        '',
        `${inquiry.attachments.length} attachment(s). Review securely in the staff dashboard.`,
      ].join('\n'),
    });
    if (error) {
      console.error('Inquiry email delivery failed', inquiry.id, error.message);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('Inquiry email delivery failed', inquiry.id, error instanceof Error ? error.message : 'Unknown error');
    return 'failed';
  }
}
