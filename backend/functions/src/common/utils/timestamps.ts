import * as admin from 'firebase-admin';

export function getIsoTimestamp(): string {
  return new Date().toISOString();
}

export function getServerTimestamp(): admin.firestore.FieldValue {
  return admin.firestore.FieldValue.serverTimestamp();
}

export function isPast(dateIso: string): boolean {
  return new Date(dateIso).getTime() < Date.now();
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}
