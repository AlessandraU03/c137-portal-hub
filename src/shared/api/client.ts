const BASE_URL = 'https://rickandmortyapi.com/api';

export async function clientFetch<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}
