import { Types } from 'mongoose';


/**
 * Convert a string to a Mongoose ObjectId.
 * @param id - The string to convert.
 * @returns The converted ObjectId.
 * @throws Error if the provided string is not a valid ObjectId.
 */
export function toObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
  return new Types.ObjectId(id);
}

/**
 * Check if a value is a valid Mongoose ObjectId.
 * @param id - The value to check.
 * @returns True if the value is a valid ObjectId, otherwise false.
 */
export function isValidObjectId(id: any): boolean {
  return Types.ObjectId.isValid(id);
}
