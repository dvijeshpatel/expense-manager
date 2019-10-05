import express from 'express';
import jwt  from 'jsonwebtoken';

import _isEmpty from 'lodash/isEmpty';

import userController from '../controllers/userController';

const router: express.Router = express.Router();

router.post('/signup', async (req: express.Request, res: express.Response) => {
    const { user } = req.body;
   // const { email ,password } = user;
   // const token: string = jwt.sign({ email}, <any> process.env.JWT_PRIVATE_KEY);
    try {
        const savedUser = await userController.createUser(user);
        res.status(200).json({
         //  token,
        user: savedUser,
        });
    } catch (err) {
        res.status(500).json({
           errorMessage: err,
        });
    }
});

router.post('/login', async (req: express.Request, res: express.Response) => {
    const { user } = req.body;
    try {
        const searchedUser = await userController.findUser(user);
        if (_isEmpty(searchedUser)) {
            res.status(401).json({
                errorMessage: 'User Not Found',
            });
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