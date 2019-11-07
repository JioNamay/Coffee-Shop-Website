/**
 * Stores information about the user to be displayed on admin page
 */
export class UserInfo {
  constructor(userId, firstName, lastName, email) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
