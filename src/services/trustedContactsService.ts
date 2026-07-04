import firestore from '@react-native-firebase/firestore';
import { TrustedContact } from '@models/TrustedContacts';

/** Firestore-backed trusted contacts. Collection: users/{uid}/trustedContacts/{id} */
const contactsCollection = (uid: string) => firestore().collection('users').doc(uid).collection('trustedContacts');

export const fetchTrustedContacts = async (uid: string): Promise<TrustedContact[]> => {
  const snap = await contactsCollection(uid).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as TrustedContact);
};

export const addTrustedContactRemote = async (uid: string, contact: Omit<TrustedContact, 'id'>): Promise<void> => {
  await contactsCollection(uid).add(contact);
};

export const removeTrustedContactRemote = async (uid: string, id: string): Promise<void> => {
  await contactsCollection(uid).doc(id).delete();
};

export const updateTrustedContactRemote = async (
  uid: string,
  id: string,
  fields: Partial<TrustedContact>,
): Promise<void> => {
  await contactsCollection(uid).doc(id).update(fields);
};
