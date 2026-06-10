export type RideStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type RideType = 'ride' | 'delivery';

export interface Ride {
  id: number;
  type: RideType;
  status: RideStatus;
  city: string;
  driver: string;
  customer: string;
  origin: string;
  destination: string;
  distanceKm: number;
  price: number;
  createdAt: string;
}