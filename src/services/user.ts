import ModelService from './model';
import { User, UserModel } from '../models/User';
import { JWTSign, JWTVerify } from '../services/jwt';
import { HttpResponseError } from '../lib/http';

/**
 *
 *
 * @interface LoginResponse
 */
export interface LoginResponse {
    token: string
}

/**
 *
 *
 * @class UserService
 * @extends {ModelService}
 */
class UserService extends ModelService {
    /**
     *
     *
     * @protected
     * @memberof EventService
     */
    protected Model = User

    /**
     *
     *
     * @param {string} email
     * @param {string} password
     * @param {string} ip
     * @param {string} host
     * @returns {(Promise<UserModel|HttpResponseError|undefined>)}
     * @memberof UserService
     */
    public async login (email: string, password: string, ip: string, host: string): Promise<LoginResponse|HttpResponseError> {
      let user: UserModel|null;

      try {
        user = await User.findOne({ email: email });
        const isMatch = await user!.comparePassword(password);

        if (!isMatch || !user) return { code: 401, data: { message: 'Password invalid.' } } as HttpResponseError;
        else {
          await User.updateOne({ _id: user!.id }, { lastLogin: new Date(), location: ip, active: true });
          const JWTToken = JWTSign({ _id: user.id, name: user.name, email: user.email, host: host });
          return { token: JWTToken };
        }
      } catch (error) {
        return { code: 404, data: error } as HttpResponseError;
      }
    }

    /**
     *
     *
     * @param {string} token
     * @param {string} id
     * @param {string} host
     * @returns {(boolean|HttpResponseError)}
     * @memberof UserService
     */
    public auth (token: string, id: string, host: string): boolean|HttpResponseError {
      if (!token || !id || !host) return { code: 401, data: { message: 'No token provided.' } } as HttpResponseError;
      const verified = JWTVerify(token, id, host);
      if (verified) return true;
      else return false;
    }
}

export default new UserService();
