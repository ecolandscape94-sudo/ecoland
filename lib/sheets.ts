import { JWT } from 'google-auth-library';
import { randomUUID } from 'node:crypto';
import { collectionSchemas, type Collection, type ContentRecord } from './models';
import { seed } from './seed';
export function sheetsConfigured() { return !!(process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && !process.env.GOOGLE_PRIVATE_KEY.includes('...')); }
let client: JWT | undefined;
export async function sheetRequest(path = '', options: RequestInit = {}) {
  if (!sheetsConfigured()) throw new Error('Google Sheets is not configured');
  client ??= new JWT({ email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const token = await client.getAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_ID}${path}`, { ...options, headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json', ...options.headers }, cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) { console.error('Sheets request failed', response.status); throw new Error('Content storage is temporarily unavailable'); }
  return response.json();
}
export function parseRows(collection: Collection, rows: string[][]): ContentRecord[] {
  return rows.flatMap((row, index) => {
    try { const data = JSON.parse(row[1] || '{}'); if (data.id !== row[0]) throw new Error('Invalid row identity'); return [collectionSchemas[collection].parse(data)]; }
    catch { console.error(`Invalid ${collection} row ${index + 2}; record skipped`); return []; }
  });
}
export async function listRecords(collection: Collection): Promise<ContentRecord[]> {
  if (!sheetsConfigured()) return structuredClone(seed[collection]);
  const response = await sheetRequest(`/values/${encodeURIComponent(`'${collection}'!A2:D`)}`);
  return parseRows(collection, response.values || []);
}
export async function saveRecord(collection: Collection, record: ContentRecord, createOnly = false, request: typeof sheetRequest = sheetRequest) {
  const validated = collectionSchemas[collection].parse(record);
  const range = encodeURIComponent(`'${collection}'!A2:D`);
  const response = await request(`/values/${range}`);
  const rows: string[][] = response.values || [];
  const index = rows.findIndex(row => row[0] === validated.id);
  if (createOnly && index >= 0) throw new Error('Record already exists');
  if ('slug' in validated && rows.some(row => row[0] !== validated.id && (() => { try { return JSON.parse(row[1]).slug === validated.slug; } catch { return false; } })())) throw new Error('This URL slug is already in use');
  const now = new Date().toISOString();
  const values = [[validated.id, JSON.stringify(validated), index >= 0 ? rows[index][2] || now : now, now]];
  if (index >= 0) await request(`/values/${encodeURIComponent(`'${collection}'!A${index + 2}:D${index + 2}`)}?valueInputOption=RAW`, { method: 'PUT', body: JSON.stringify({ values }) });
  else await request(`/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: 'POST', body: JSON.stringify({ values }) });
  return validated;
}
export async function audit(actor: string, action: string, recordId: string) {
  await sheetRequest(`/values/${encodeURIComponent("'audit'!A:D")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: 'POST', body: JSON.stringify({ values: [[randomUUID(), JSON.stringify({ actor, action, recordId }), new Date().toISOString(), '']] }) });
}
