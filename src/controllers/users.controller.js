import { UsersRepository } from '../repositories/users.repository.js';
import { UsersService } from '../services/users.service.js';
import { pageLinks } from '../utils/query.js';

// The controller reads information from each HTTP request and calls the service.
// It turns the service result into an HTTP response for the client.
export class UsersController {
  constructor() {
    // The controller creates a real service and repository whenever it is constructed.
    // Tests cannot easily pass in a fake service, so they are harder to isolate.
    this.usersService = new UsersService(new UsersRepository());
  }

  // Express calls these handlers as plain functions, which can lose their class `this`.
  // Arrow fields keep `this` bound to this controller instance.
  list = async (req, res) => {
    const { data, meta } = await this.usersService.list(req.query);
    res.json({ data, meta, links: pageLinks(req, meta) });
  };

  getById = async (req, res) => {
    res.json({ data: await this.usersService.getById(req.params.id) });
  };

  create = async (req, res) => {
    const user = await this.usersService.create(req.body);
    res.status(201).location(`${req.baseUrl}/${user.id}`).json({ data: user });
  };

  update = async (req, res) => {
    res.json({ data: await this.usersService.update(req.params.id, req.body) });
  };

  remove = async (req, res) => {
    await this.usersService.remove(req.params.id);
    res.status(204).end();
  };
}