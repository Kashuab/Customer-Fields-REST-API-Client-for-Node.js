export function randomFromArray<T = unknown>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
