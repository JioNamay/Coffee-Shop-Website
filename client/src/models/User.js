/**
 * Stores information about the user.
 */
export class User {
  constructor(userId, firstName, lastName, email, token) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }
}
