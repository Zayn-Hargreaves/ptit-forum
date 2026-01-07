import { AxiosResponse } from 'axios';
// Imports removed as they are unused

// function applyFieldErrors removed as it is unused

export async function unwrapData<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
  const res = await p;
  return res.data;
}
