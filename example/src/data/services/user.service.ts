import { User } from '../entities/user.entity';

/**
 * This is stub service we advise to use for example typeorm for database connection management.
 */
let stubUser: User = {
  id: 1, mail: "example@example.com", password_hash: "hash", role: "admin", user_name: "administrator"
}

export class UserService {
    constructor () {
    }

    async getUserById(id: number): Promise<User> {
      if (id === stubUser.id)
        return stubUser;
      else
        return null;
    }

    async getUserByEmail(mail: string): Promise<User> {
      if (mail === stubUser.mail)
        return stubUser;
      else
        return null;
    }
}