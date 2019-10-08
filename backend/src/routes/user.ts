import express from 'express';
import jwt from 'jsonwebtoken';

import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import MailSender from '../MailSender';
import User from '../entities/User';
import userController from '../controllers/userController';


declare global {
    namespace Express {
        interface Request {
            user: User;
            otp?: string;
        }
    }
}

const MAIL_TO_OTP: { [key: string]: string } = {};

const router: express.Router = express.Router();


const paramsAdderMiddleWare = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {email, password, otp} = _get(req.body, 'user', {});
    req.user = new User(email, password);
    req.otp = otp;
    next();
};

const userNotFoundMiddleWare = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const searchedUser = await userController.searchUser(req.user);
        if (!searchedUser) {
            res.status(401).json({
                mail: 'User Not Found',
            }).end();
            return;
        }
        next();
    } catch (err) {
        res.status(500).json({
            errorMessage: err,
        });
    }
};


const userFoundMiddleWare = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const searchedUser = await userController.searchUser(req.user);
        if (searchedUser && searchedUser.isVerified) {
            res.status(401).json({
                message: 'User already exist',
            }).end();
            return;
        }
        next();
    } catch (err) {
        res.status(500).json({
            errorMessage: err,
        });
    }
};

router.use(paramsAdderMiddleWare);

router.post('/verify', [ userNotFoundMiddleWare, userFoundMiddleWare, async (req: express.Request, res: express.Response) => {
    try {
        const { otp } = req;
        if (MAIL_TO_OTP[req.user.email] !== otp) {
            res.status(401).json({
                mail: 'OTP not matched',
            }).end();
            return;
        }
        const searchedUser = await userController.searchUser(req.user);
        if (!searchedUser) {
            return;
        }
        searchedUser.isVerified = true;

        await userController.createUser(searchedUser);

        res.status(200).json({
            message: 'User SuccessFully Created',
        }).end();

        return;

    } catch (err) {
        res.status(500).json({
            errorMessage: err,
        });
    }
}]);

router.post('/signup', [ userFoundMiddleWare, async (req: express.Request, res: express.Response) => {
    try {
        await userController.removeUser(req.user);
        await userController.createUser(req.user);

        const OTP = Math.floor((Math.random() * 10000 + 54) % 1000).toString();

        MAIL_TO_OTP[req.user.email] = OTP;

        const mailOptions = {
            from: process.env.ADMIN_MAIL,
            to: req.user.email,
            subject: 'OTP for Expense-Manager',
            html: `<div>Your OTP for Expanse Manager ${OTP}</div>`
        };

        await MailSender.sendMail(mailOptions);

        res.status(200).json({
            message: 'OTP is sent to to your email address',
        }).end();

    } catch (err) {
        res.status(500).json({
            errorMessage: err,
        }).end();
    }
}]);

router.post('/login', [userNotFoundMiddleWare, async (req: express.Request, res: express.Response) => {
    try {
        const {user} = req;
        const searchedUser = await userController.searchUser(user);
        if (!searchedUser) {
            res.status(401).json({
                mail: 'User Not Found',
            }).end();
            return;
        }
        const token: string = jwt.sign({email: user.email}, <any> process.env.JWT_PRIVATE_KEY);
        res.status(200).json({token});
    } catch (err) {
        res.status(500).json({
            errorMessage: err,
        }).end();
    }
}]);

export default router;