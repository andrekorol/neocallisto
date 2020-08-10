export function getSeed(): Promise<Uint8Array>;

export function getHash(
  password: string | Uint8Array,
  salt: Uint8Array
): Promise<Uint8Array>;
