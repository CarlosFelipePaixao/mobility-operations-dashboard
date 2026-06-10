import type { Ride, RideStatus } from '../types/ride';

export type StatusFilter = RideStatus | 'all';
export type SortOption = 'newest' | 'oldest' | 'price_desc' | 'price_asc';

export interface RideFilters {
  status: StatusFilter;
  city: string;
  searchTerm: string;
  sortBy: SortOption;
}

export function getUniqueCities(rides: Ride[]): string[] {
  const cities = rides.map((ride) => ride.city);
  return [...new Set(cities)].sort();
}

export function filterAndSortRides(rides: Ride[], filters: RideFilters): Ride[] {
  let filteredRides = [...rides];

  if (filters.status !== 'all') {
    filteredRides = filteredRides.filter((ride) => ride.status === filters.status);
  }

  if (filters.city !== 'all') {
    filteredRides = filteredRides.filter((ride) => ride.city === filters.city);
  }

  if (filters.searchTerm.trim()) {
    const search = filters.searchTerm.toLowerCase().trim();

    filteredRides = filteredRides.filter((ride) => {
      return (
        ride.driver.toLowerCase().includes(search) ||
        ride.customer.toLowerCase().includes(search) ||
        ride.origin.toLowerCase().includes(search) ||
        ride.destination.toLowerCase().includes(search)
      );
    });
  }

  filteredRides.sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (filters.sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (filters.sortBy === 'price_desc') {
      return b.price - a.price;
    }

    return a.price - b.price;
  });

  return filteredRides;
}