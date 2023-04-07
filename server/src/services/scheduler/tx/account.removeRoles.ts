import { AccountAddRoles } from "./account.addRoles";

// Implements the same interface as addRoles so just reuse that.
export class AccountRemoveRoles extends AccountAddRoles {
  static method = "account.removeRoles";
  static eventType = [9, 3];
}
