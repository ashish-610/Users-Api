import { digitsOnly, integer, isbn13, money, oneOf, string, trim } from './rules.js';

export const BOOK_GENRES = ['programming', 'databases', 'devops', 'security'];

export const createBookSchema = {
  title:         { required: true, check: string({ max: 200 }), transform: trim },
  author:        { required: true, check: string({ max: 120 }), transform: trim },
  isbn:          { required: true, check: isbn13(), transform: digitsOnly },
  publishedYear: { required: true, check: integer({ min: 1000, max: new Date().getFullYear() }) },
  price:         { required: true, check: money() },
  stock:         { required: true, check: integer({ min: 0 }) },
  genre:         { required: true, check: oneOf(BOOK_GENRES) },
};

export const updateBookSchema = createBookSchema;
