import UsersDao from '../../src/users/daos/users.dao';

describe('users.dao test suite', () => {
  describe('constructor', () => {
    test.todo('');
  });

  describe('getInstance', () => {
    test.todo('');
  });

  describe('addUser', () => {
    test.todo('');
  });

  describe('getUsers', () => {
    test.todo('');
  });

  describe('getUserById', () => {
    test.todo('');
  });

  describe('putUserById', () => {
    test.todo('');
  });

  describe('patchUserById', () => {
    test.todo('');
  });

  describe('removeUserById', () => {
    test.todo('');
  });

  describe('getUserByEmail', () => {
    test.todo('');

    test('簡単に挙動を確認する', async () => {
      // Arrange
      const inputEmail = 'example@example.com';
      // Act
      await UsersDao.getUserByEmail(inputEmail);
      // Assert
    });
  });
});
