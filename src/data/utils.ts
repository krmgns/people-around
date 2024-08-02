/**
 * This file contains some utilities.
 */

import { createHash } from 'crypto';

/**
 * Ali's latitude / longitude.
 * Used for seeding and testing.
 */
export const ALI_LAT = 1.81912248;
export const ALI_LON = 39.53409246;

/**
 * Simple JSON helper.
 */
export class Json {
  static encode(input: any): string {
    return JSON.stringify(input);
  }

  static decode(input: string): any {
    return JSON.parse(input);
  }
};

/**
 * Key maker for cache.
 */
export function toKey(...args: any): string {
  const prefix: string = args[0];
  const input: string = JSON.stringify(args);

  // Prefix is for key search (eg: client.keys('user_*'))
  return prefix + '_' + createHash('md5').update(input).digest('hex');
}

const ALPHABET: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function getRandomString(length: number, base: number = 62): string {
  // Save for dead-lock.
  if (!length || length < 1) {
    throw new Error('Invalid length, min=1');
  }

  let alp: string = ALPHABET.slice(0, base);
  let ret: string = '';

  while (length--) {
      ret += alp[~~(Math.random() * alp.length)];
  }

  return ret;
}

export function getRandomNumber(min: number, max: number, fix: number = 8): number {
  return Number((Math.random() * (max - min) + min).toFixed(fix));
}

export function getRandomLatitude(): number {
  return getRandomNumber(-90.0, 90.0);
}
export function getRandomLongitude(): number {
  return getRandomNumber(-180.0, 180.0);
}

export function validateLatitude(input: number): boolean {
  return isFinite(input) && Math.abs(input) <= 90.0;
}
export function validateLongitude(input: number): boolean {
  return isFinite(input) && Math.abs(input) <= 180.0;
}
