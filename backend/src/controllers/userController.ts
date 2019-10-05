import { getRepository } from 'typeorm';
import User from '../entities/User';

class UserController {
    static createUser = async<T extends { email: string, password: string}>(user: T) => {
        const { email, password } = user;
        const userToSave: User = new User(email, password);
        const userRepository = getRepository(User);
        try {
            const savedUser = await userRepository.save(userToSave);
            return savedUser;
        } catch (err) {
            throw err;
        }
    }

    static findUser = async<T extends {email: string, password: string}> (user: T) => {
        const { email, password } = user;
        const userToFind: User = new User(email, password);
        const userRepository = getRepository(User);
        try {
           const searchedUser =  await userRepository.findOne(userToFind); 
            return searchedUser;
        } catch (err) {
            throw err;
        }
    }
}

export default UserController;