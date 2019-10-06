import express from 'express';
import jwt  from 'jsonwebtoken';

import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import User from '../entities/User';
import userController from '../controllers/userController';


declare global {
    namespace Express {
      interface Request {
        user: User;
      }
    }
  }
  
const router: express.Router = express.Router();

router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = _get(req.body, 'user', {});
    req.user = new User(email, password);
    next();
});

router.post('/signup', async (req: express.Request, res: express.Response) => {
    try {
        const searchedUser = await userController.findUser(req.user);
        if (!_isEmpty(searchedUser)) {
            res.status(401).json({
                message: 'User already exist',
            }).end();
            return;
        }
        const savedUser = await userController.createUser(req.user);
        res.status(200).json({
            user: savedUser,
        });
    } catch (err) {
        res.status(500).json({
           errorMessage: err,
        });
    }
});

router.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req;
        const searchedUser = await userController.findUser(user);
        if (_isEmpty(searchedUser)) {
            res.status(401).json({
                errorMessage: 'User Not Found',
            }).end();
            return;
        } 
        const token: string = jwt.sign({ email: user.email }, <any> process.env.JWT_PRIVATE_KEY);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({
            errorMessage: err,
        });
    }
});

export default router;