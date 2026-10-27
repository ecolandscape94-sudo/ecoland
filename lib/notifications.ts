import { Resend } from 'resend';
import type { Inquiry } from './models';
import { renderInquiryEmail } from './inquiry-email';

export type InquiryEmailAttachment = { filename: string; content: string; contentType: string };

export async function notifyInquiry(inquiry: Inquiry, emailAttachments?: InquiryEmailAttachment[]): Promise<Inquiry['notification']> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !recipient) return 'unconfigured';

  try {
    const resend = new Resend(apiKey);
    const { html, text } = renderInquiryEmail(inquiry, emailAttachments?.length);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: recipient,
      replyTo: inquiry.email,
      subject: `New Eco Landscapes inquiry: ${inquiry.service.replace(/[\r\n]/g, ' ')}`,
      ...(emailAttachments?.length ? { attachments: emailAttachments } : {}),
      html,
      text,
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
