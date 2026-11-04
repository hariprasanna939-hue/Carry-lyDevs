import { VehicleRepository } from './vehicle.repository';
import { RegisterVehicleInput, VehicleRecord } from './vehicle.types';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { AppError } from '../../common/errors/AppError';
import { CONSTANTS } from '../../config/constants';

export interface VehicleSizeSpec {
  type: string;
  displayName: string;
  capacityKg: number;
  dimensions: string;
  idealFor: string[];
  baseFare: number;
}

export class VehicleService {
  /**
   * 1. Register Vehicle
   */
  public static async registerVehicle(driverId: string, input: RegisterVehicleInput): Promise<VehicleRecord> {
    const id = generateId('veh');
    const now = getIsoTimestamp();

    const vehicle: VehicleRecord = {
      id,
      driverId,
      vehicleType: input.vehicleType,
      registrationNumber: input.registrationNumber,
      capacityKg: input.capacityKg || 500,
      vehiclePhotos: input.vehiclePhotos || [],
      verificationStatus: 'pending',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await VehicleRepository.save(vehicle);
    return vehicle;
  }

  /**
   * 2. Update Vehicle
   */
  public static async updateVehicle(
    driverId: string,
    vehicleId: string,
    updates: Partial<VehicleRecord>
  ): Promise<VehicleRecord> {
    const vehicle = await VehicleRepository.getById(vehicleId);
    if (!vehicle) throw new AppError('not-found', 'Vehicle not found');

    if (vehicle.driverId !== driverId) {
      throw new AppError('permission-denied', 'You do not own this vehicle');
    }

    const sanitizedUpdates: Partial<VehicleRecord> = {
      ...updates,
      updatedAt: getIsoTimestamp(),
    };

    await VehicleRepository.save({ ...vehicle, ...sanitizedUpdates });
    return { ...vehicle, ...sanitizedUpdates };
  }

  /**
   * 3. List Vehicle Sizes
   */
  public static listVehicleSizes(): VehicleSizeSpec[] {
    return [
      {
        type: CONSTANTS.VEHICLE_TYPES.TWO_WHEELER,
        displayName: '2-Wheeler (Bike / Scooter)',
        capacityKg: CONSTANTS.DEFAULT_RATES.two_wheeler.capacityKg,
        dimensions: '40 x 40 x 40 cm',
        idealFor: ['Documents', 'Food packets', 'Small parcels up to 20kg'],
        baseFare: CONSTANTS.DEFAULT_RATES.two_wheeler.baseFare,
      },
      {
        type: CONSTANTS.VEHICLE_TYPES.THREE_WHEELER,
        displayName: '3-Wheeler (Auto Cargo)',
        capacityKg: CONSTANTS.DEFAULT_RATES.three_wheeler.capacityKg,
        dimensions: '5 x 4 x 4 ft',
        idealFor: ['Boxes', 'Small appliances', 'E-commerce deliveries up to 500kg'],
        baseFare: CONSTANTS.DEFAULT_RATES.three_wheeler.baseFare,
      },
      {
        type: CONSTANTS.VEHICLE_TYPES.TATA_ACE,
        displayName: 'Tata Ace (Chhota Hathi)',
        capacityKg: CONSTANTS.DEFAULT_RATES.tata_ace.capacityKg,
        dimensions: '7 x 4.5 x 5 ft',
        idealFor: ['House shifting (1BHK)', 'Industrial machinery', 'Wholesale market cargo up to 750kg'],
        baseFare: CONSTANTS.DEFAULT_RATES.tata_ace.baseFare,
      },
      {
        type: CONSTANTS.VEHICLE_TYPES.PICKUP_8FT,
        displayName: '8ft Pickup / Bolero Maxi',
        capacityKg: CONSTANTS.DEFAULT_RATES.pickup_8ft.capacityKg,
        dimensions: '8 x 5 x 5.5 ft',
        idealFor: ['Heavy timber', 'Tiles & construction items', 'Commercial bulk cargo up to 1200kg'],
        baseFare: CONSTANTS.DEFAULT_RATES.pickup_8ft.baseFare,
      },
    ];
  }

  /**
   * 4. Validate Documents
   */
  public static async validateVehicleDocuments(
    vehicleId: string,
    docs: { rcDocUrl?: string; insuranceDocUrl?: string; fitnessDocUrl?: string }
  ) {
    const vehicle = await VehicleRepository.getById(vehicleId);
    if (!vehicle) throw new AppError('not-found', 'Vehicle not found');

    const isValid = Boolean(docs.rcDocUrl && docs.insuranceDocUrl);
    const updates = {
      rcDocUrl: docs.rcDocUrl,
      insuranceDocUrl: docs.insuranceDocUrl,
      fitnessDocUrl: docs.fitnessDocUrl,
      documentsSubmitted: isValid,
      verificationStatus: (isValid ? 'pending' : 'rejected') as VehicleRecord['verificationStatus'],
      updatedAt: getIsoTimestamp(),
    };

    await VehicleRepository.save({ ...vehicle, ...updates });
    return {
      vehicleId,
      documentsSubmitted: isValid,
      verificationStatus: updates.verificationStatus,
    };
  }

  public static async getDriverVehicles(driverId: string): Promise<VehicleRecord[]> {
    return VehicleRepository.getByDriverId(driverId);
  }
}
