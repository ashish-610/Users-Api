import { InMemoryRepository } from './in-memory.repository.js';

// The repository handles finding and storing user records for the service.
// This version keeps records in memory instead of using a database.
export class UsersRepository extends InMemoryRepository {
  findByEmail(email) {
    return this.findOne((user) => user.email === email.toLowerCase());
  }
}