import { Router } from 'express';
import { BooksController } from '../controllers/books.controller.js';
import { validateBody } from '../middleware/validate-body.js';
import { createBookSchema, updateBookSchema } from '../validators/book.schema.js';

const controller = new BooksController();

export const booksRouter = Router();

booksRouter.get('/', controller.list);
booksRouter.get('/:id', controller.getById);
booksRouter.post('/', validateBody(createBookSchema), controller.create);
booksRouter.patch('/:id', validateBody(updateBookSchema, { partial: true }), controller.update);
booksRouter.delete('/:id', controller.remove);
