import type { Ride } from '../types/ride';

export async function getRides(): Promise<Ride[]> {
  const response = await fetch('/api/rides.json');

  if (!response.ok) {
    throw new Error('Erro ao carregar as corridas.');
  }

  return response.json();
}