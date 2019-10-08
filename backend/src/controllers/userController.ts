import { getRepository } from 'typeorm';
import User from '../entities/User';

class UserController {
    static createUser = async<T extends { email: string, password: string}>(user: T): Promise<User> => {
        const userRepository = getRepository(User);
        try {
            return await userRepository.save(user);
        } catch (err) {
            throw err;
        }
    }

    static searchUser = async<T extends {email: string, password: string}> (user: T): Promise<User | undefined>  => {
        const userRepository = getRepository(User);
        try {
           return await userRepository.findOne({ email: user.email });
        } catch (err) {
            throw err;
        }
    }

    static removeUser = async<T extends {email: string }> (user: T): Promise<any>  => {
        const userRepository = getRepository(User);
        try {
           const searcheduser = await userRepository.find(user); 
           userRepository.remove(searcheduser);
        } catch (err) {
            throw err;
        }
    }
}

export default UserController;