import { getRepository } from 'typeorm';
import User from '../entities/User';

class UserController {
    static createUser = async<T extends { email: string, password: string}>(user: T) => {
        const userRepository = getRepository(User);
        try {
            const savedUser = await userRepository.save(user);
            return savedUser;
        } catch (err) {
            throw err;
        }
    }

    static findUser = async<T extends {email: string, password: string}> (user: T) => {
        const userRepository = getRepository(User);
        try {
           const searchedUser =  await userRepository.findOne(user); 
            return searchedUser;
        } catch (err) {
            throw err;
        }
    }
}

export default UserController;