import { conflict, notFound } from '../utils/http-error.js';
import { paginate, parsePagination, sortItems } from '../utils/query.js';

const SORTABLE_FIELDS = ['title', 'author', 'isbn', 'price', 'publishedYear', 'createdAt'];

export class BooksService {
  constructor(booksRepository) {
    this.books = booksRepository;
  }

  async list(query = {}) {
    let items = await this.books.findAll();

    if (typeof query.q === 'string' && query.q.trim()) {
      const needle = query.q.trim().toLowerCase();
      items = items.filter((book) =>
        `${book.title} ${book.author} ${book.isbn}`.toLowerCase().includes(needle),
      );
    }

    items = sortItems(items, query.sort ?? 'title', SORTABLE_FIELDS);
    return paginate(items, parsePagination(query));
  }

  async getById(id) {
    const book = await this.books.findById(id);
    if (!book) throw notFound(`Book ${id} does not exist`);
    return book;
  }

  async create(data) {
    await this.#assertIsbnAvailable(data.isbn);
    return this.books.create({
      ...data,
      genre: data.genre ?? null,
      publishedYear: data.publishedYear ?? null,
      description: data.description ?? null,
    });
  }

  async update(id, changes) {
    await this.getById(id);
    if (changes.isbn) await this.#assertIsbnAvailable(changes.isbn, id);
    return this.books.update(id, changes);
  }

  async remove(id) {
    await this.getById(id);
    await this.books.delete(id);
  }

  async #assertIsbnAvailable(isbn, exceptId) {
    const existing = await this.books.findByIsbn(isbn);
    if (existing && existing.id !== exceptId) {
      throw conflict(`ISBN ${isbn} is already registered`);
    }
  }
}
