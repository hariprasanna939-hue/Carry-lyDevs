import { AddressRepository, SavedAddress } from './address.repository';
import { SaveAddressInput } from './address.validation';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { AppError } from '../../common/errors/AppError';

export class AddressService {
  /**
   * 1. Save Address
   */
  public static async saveAddress(userId: string, input: SaveAddressInput): Promise<SavedAddress> {
    const record: SavedAddress = {
      id: generateId('addr'),
      userId,
      ...input,
      createdAt: getIsoTimestamp(),
    };
    await AddressRepository.save(record);
    return record;
  }

  /**
   * 2. Edit Address
   */
  public static async editAddress(
    userId: string,
    addressId: string,
    updates: Partial<SaveAddressInput>
  ): Promise<SavedAddress> {
    const docRef = db.collection(COLLECTIONS.SAVED_ADDRESSES).doc(addressId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError('not-found', 'Saved address not found');
    }

    const current = doc.data() as SavedAddress;
    if (current.userId !== userId) {
      throw new AppError('permission-denied', 'You cannot edit an address belonging to another user');
    }

    const sanitizedUpdates = {
      ...updates,
      updatedAt: getIsoTimestamp(),
    };

    await docRef.set(sanitizedUpdates, { merge: true });
    return { ...current, ...sanitizedUpdates };
  }

  /**
   * 3. Delete Address
   */
  public static async deleteAddress(userId: string, addressId: string): Promise<void> {
    const docRef = db.collection(COLLECTIONS.SAVED_ADDRESSES).doc(addressId);
    const doc = await docRef.get();
    if (doc.exists && doc.data()?.userId === userId) {
      await AddressRepository.delete(addressId);
    }
  }

  /**
   * 4. List Saved Addresses
   */
  public static async listSavedAddresses(userId: string): Promise<SavedAddress[]> {
    return AddressRepository.getByUserId(userId);
  }
}
