import UsersDao from '../../../src/users/daos/users.dao';
import DataStore from 'nedb';
import shortid from 'shortid';
import { UserDto } from '../../../src/users/dto/user.model';

jest.mock('nedb');
jest.mock('shortid');

describe('users.dao test suite', (): void => {
  describe('addUser', (): void => {
    let nedbSpy: jest.SpyInstance;
    let shortidSpy: jest.SpyInstance;

    beforeEach((): void => {
      nedbSpy = jest.spyOn(DataStore.prototype, 'insert');
      shortidSpy = jest.spyOn(shortid, 'generate');
    });

    test('ユーザの登録に成功する', async (): Promise<void> => {
      // Arrange
      const expected: UserDto = {
        id: 'user1',
        email: 'test@test.com',
        password: 'test',
      };
      const testData: UserDto = {
        id: '',
        email: 'test@test.com',
        password: 'test',
      };
      shortidSpy.mockImplementationOnce((): string => {
        return expected.id;
      });
      nedbSpy.mockImplementationOnce((someUser: any, cb: any) => {
        cb(expected);
      });
      // Act
      const actual = await UsersDao.addUser(testData);
      // Assert
      expect(shortidSpy).toHaveBeenCalled();
      expect(nedbSpy).toHaveBeenCalledWith(expected, expect.any(Function));
      expect(actual).toBe(expected.id);
    });
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
  });
});
