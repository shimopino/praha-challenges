import { UserDto } from '../dto/user.model';
import DataStore from 'nedb';
import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

/**
 * NEVER USER THIS CLASS IN REAL LIFE.
 * This class was created to easy it up the explanation of other topics meanwhile writing the articles.
 * For any scenario consider using an ODM/ORM to manage your own database in a better way.
 */
class UsersDao {
  private static instance: UsersDao;
  private nedb: DataStore;

  constructor(nedb = new DataStore('databases/users.db')) {
    log('Created new instance of UsersDao');
    this.nedb = nedb;
    this.nedb.loadDatabase();
  }

  static getInstance(): UsersDao {
    if (!UsersDao.instance) {
      UsersDao.instance = new UsersDao();
    }
    return UsersDao.instance;
  }

  async addUser(user: UserDto): Promise<string> {
    return new Promise((resolve, reject) => {
      user.id = shortid.generate();
      this.nedb.insert(user, (err: Error | null, docs: UserDto) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs.id);
        }
      });
    });
  }

  async getUsers(): Promise<UserDto[]> {
    return new Promise((resolve, reject) => {
      this.nedb.find({}, (err: Error | null, docs: UserDto[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  async getUserById(userId: string): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id: userId }, (err: Error | null, docs: UserDto[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs[0]);
        }
      });
    });
  }

  async putUserById(user: UserDto): Promise<string> {
    return new Promise((resolve, reject) => {
      this.nedb.update(
        { id: user.id },
        user,
        {},
        (err: Error | null, numberOfUpdate: number, upsert: boolean) => {
          if (err) {
            reject(err);
          } else {
            resolve(`${user.id} updated via put`);
          }
        },
      );
    });
  }

  async patchUserById(user: UserDto): Promise<string> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id: user.id }, (err: Error | null, docs: UserDto) => {
        if (err) {
          reject(err);
        } else {
          const allowedPatchFields = [
            'password',
            'firstName',
            'lastName',
            'permissionLevel',
          ];
          for (let field of allowedPatchFields) {
            if (field in user) {
              // @ts-ignore
              docs[field] = user[field];
            }
          }
          this.nedb.update(
            { id: user.id },
            user,
            {},
            (err: Error | null, numberOfUpdate: number, upsert: boolean) => {
              if (err) {
                reject(err);
              } else {
                resolve(`${user.id} patched`);
              }
            },
          );
        }
      });
    });
  }

  async removeUserById(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.nedb.remove({ id: userId }, {}, (err: Error | null, n: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${userId} removed`);
        }
      });
    });
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ email: email }, (err: Error | null, docs: UserDto[]) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length !== 0) {
            resolve(docs[0]);
          }
          resolve(null);
        }
      });
    });
  }
}

export default UsersDao.getInstance();
