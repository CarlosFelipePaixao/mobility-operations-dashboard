import { describe, expect, it } from 'vitest';
import type { Ride } from '../types/ride';
import { filterAndSortRides, getUniqueCities, type RideFilters } from './rideFilters';

const rides: Ride[] = [
  {
    id: 1,
    type: 'ride',
    status: 'completed',
    city: 'Curitiba',
    driver: 'Marcos Silva',
    customer: 'Ana Souza',
    origin: 'Centro',
    destination: 'Batel',
    distanceKm: 6.4,
    price: 28.9,
    createdAt: '2026-06-10T09:20:00',
  },
  {
    id: 2,
    type: 'delivery',
    status: 'pending',
    city: 'São Paulo',
    driver: 'Carla Mendes',
    customer: 'Restaurante Bella Massa',
    origin: 'Moema',
    destination: 'Vila Mariana',
    distanceKm: 4.2,
    price: 18.5,
    createdAt: '2026-06-10T10:05:00',
  },
  {
    id: 3,
    type: 'ride',
    status: 'in_progress',
    city: 'Curitiba',
    driver: 'Rafael Gomes',
    customer: 'Lucas Pereira',
    origin: 'Água Verde',
    destination: 'Cabral',
    distanceKm: 8.7,
    price: 36.4,
    createdAt: '2026-06-10T12:30:00',
  },
];

const baseFilters: RideFilters = {
  status: 'all',
  city: 'all',
  searchTerm: '',
  sortBy: 'newest',
};

describe('ride filters', () => {
  it('returns unique cities sorted alphabetically', () => {
    expect(getUniqueCities(rides)).toEqual(['Curitiba', 'São Paulo']);
  });

  it('filters rides by status', () => {
    const result = filterAndSortRides(rides, {
      ...baseFilters,
      status: 'pending',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('filters rides by city', () => {
    const result = filterAndSortRides(rides, {
      ...baseFilters,
      city: 'Curitiba',
    });

    expect(result).toHaveLength(2);
    expect(result.every((ride) => ride.city === 'Curitiba')).toBe(true);
  });

  it('filters rides by search term', () => {
    const result = filterAndSortRides(rides, {
      ...baseFilters,
      searchTerm: 'rafael',
    });

    expect(result).toHaveLength(1);
    expect(result[0].driver).toBe('Rafael Gomes');
  });

  it('sorts rides by highest price', () => {
    const result = filterAndSortRides(rides, {
      ...baseFilters,
      sortBy: 'price_desc',
    });

    expect(result.map((ride) => ride.id)).toEqual([3, 1, 2]);
  });

  it('sorts rides by oldest date', () => {
    const result = filterAndSortRides(rides, {
      ...baseFilters,
      sortBy: 'oldest',
    });

    expect(result.map((ride) => ride.id)).toEqual([1, 2, 3]);
  });
});