import { BooksRepository } from '../repositories/books.repository.js';
import { BooksService } from '../services/books.service.js';
import { pageLinks } from '../utils/query.js';

export class BooksController {
  constructor() {
    this.booksService = new BooksService(new BooksRepository());
  }

  list = async (req, res) => {
    const { data, meta } = await this.booksService.list(req.query);
    res.json({ data, meta, links: pageLinks(req, meta) });
  };

  getById = async (req, res) => {
    res.json({ data: await this.booksService.getById(req.params.id) });
  };

  create = async (req, res) => {
    const book = await this.booksService.create(req.body);
    res.status(201).location(`${req.baseUrl}/${book.id}`).json({ data: book });
  };

  update = async (req, res) => {
    res.json({ data: await this.booksService.update(req.params.id, req.body) });
  };

  remove = async (req, res) => {
    await this.booksService.remove(req.params.id);
    res.status(204).end();
  };
}
