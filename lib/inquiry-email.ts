import type { Inquiry } from './models';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

function detailRow(label: string, value: string) {
  return `<tr><td style="padding:12px 0;border-bottom:1px solid #e5ece3;color:#697a6e;font:12px Arial,sans-serif;letter-spacing:.04em;width:34%;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:12px 0;border-bottom:1px solid #e5ece3;color:#173b29;font:15px/1.5 Arial,sans-serif;overflow-wrap:anywhere;vertical-align:top;">${escapeHtml(value).replace(/\r\n|\r|\n/g, '<br>')}</td></tr>`;
}

export function renderInquiryEmail(inquiry: Inquiry, emailAttachmentCount?: number) {
  const count = emailAttachmentCount ?? inquiry.attachments.length;
  const photoNote = count === 0
    ? 'No photos were included.'
    : emailAttachmentCount !== undefined
      ? `${count} ${count === 1 ? 'photo is' : 'photos are'} attached to this email.`
      : `${count} ${count === 1 ? 'photo is' : 'photos are'} available in the staff dashboard.`;
  const text = [
    'NEW WEBSITE INQUIRY',
    `Reference: ${inquiry.id}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Telephone: ${inquiry.phone}`,
    `Service: ${inquiry.service}`,
    `Location: ${inquiry.location}`,
    `Project size: ${inquiry.size || 'Not supplied'}`,
    '',
    'MESSAGE',
    inquiry.description,
    '',
    photoNote,
    'Reply to this email to respond to the customer.',
  ].join('\n');

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New website inquiry</title></head>
<body style="margin:0;padding:0;background:#f2f5ef;color:#173b29;font-family:Arial,sans-serif;">
  <div style="display:none;font-size:1px;color:#f2f5ef;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">A new customer inquiry is ready for your attention.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f2f5ef;"><tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid #dfe8dc;border-radius:14px;overflow:hidden;">
      <tr><td style="background:#123d2a;padding:30px 28px 27px;border-bottom:5px solid #e8c83d;">
        <p style="margin:0 0 13px;color:#e9d36c;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;">Eco Landscapes &amp; Gardening</p>
        <h1 style="margin:0;color:#ffffff;font:normal 30px/1.2 Georgia,serif;">A new inquiry has arrived.</h1>
        <p style="margin:10px 0 0;color:#d5e5d6;font:14px/1.6 Arial,sans-serif;">Someone would like to talk about their outdoor space.</p>
      </td></tr>
      <tr><td style="padding:28px;">
        <p style="margin:0 0 5px;color:#68806a;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;">Customer details</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          ${detailRow('Name', inquiry.name)}
          ${detailRow('Email', inquiry.email)}
          ${detailRow('Telephone', inquiry.phone)}
          ${detailRow('Service', inquiry.service)}
          ${detailRow('Location', inquiry.location)}
          ${detailRow('Project size', inquiry.size || 'Not supplied')}
        </table>
        <p style="margin:28px 0 10px;color:#68806a;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;">Their message</p>
        <div style="padding:20px;background:#f5f8f2;border-left:3px solid #43834e;border-radius:4px;color:#263f30;font:15px/1.75 Arial,sans-serif;overflow-wrap:anywhere;">${escapeHtml(inquiry.description).replace(/\r\n|\r|\n/g, '<br>')}</div>
        <p style="margin:20px 0 0;color:#617365;font:13px/1.6 Arial,sans-serif;">${escapeHtml(photoNote)}</p>
        <p style="margin:24px 0 0;padding:16px 18px;background:#f9f5df;border-radius:6px;color:#304b32;font:14px/1.6 Arial,sans-serif;"><strong>Ready to respond?</strong> Reply to this email to reach the customer.</p>
      </td></tr>
      <tr><td style="padding:20px 28px;background:#f6f8f4;border-top:1px solid #e3ebe0;color:#708173;font:12px/1.6 Arial,sans-serif;">Website inquiry &nbsp;·&nbsp; Reference: ${escapeHtml(inquiry.id)}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  return { html, text };
}
