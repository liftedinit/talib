import { Injectable } from "@nestjs/common";
import { AdminConfigService } from "../config/admin/configuration.service";

export enum Role {
  ADMIN = "admin",
}

// This should be a real class/interface representing a user entity
export interface User {
  userId: number;
  username: string;
  password: string;
  roles: Role[];
}

@Injectable()
export class UsersService {
  constructor(private readonly adminConfig: AdminConfigService) {}

  // TODO: get this from a database.
  private readonly users: Map<string, User> = new Map();

  async findOne(username: string): Promise<User | undefined> {
    if (username === this.adminConfig.username) {
      return {
        userId: 0,
        username: this.adminConfig.username,
        password: this.adminConfig.password,
        // Admin has all roles.
        roles: [...Object.values(Role)],
      };
    }

    return this.users.get(username);
  }
}
