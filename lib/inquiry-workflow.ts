import type { Inquiry } from './models';
import { saveRecord } from './sheets';
import { notifyInquiry } from './notifications';
export async function persistAndNotify(record: Inquiry, dependencies = { save: (r: Inquiry, create: boolean) => saveRecord('inquiries', r, create), notify: notifyInquiry }) {
  // Never send email or return a success until storage has accepted the inquiry.
  await dependencies.save(record, true);
  let notification: Inquiry['notification'];
  try { notification = await dependencies.notify(record); } catch { notification = 'failed'; }
  try { await dependencies.save({ ...record, notification }, false); }
  catch { console.error('Notification status update pending', record.id); }
  return { id: record.id, notification };
}
