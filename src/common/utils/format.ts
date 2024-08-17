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
