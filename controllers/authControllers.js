const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');
const { responseReturn } = require('../utils/response');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/tokenCreate');
const delay = require('../utils/delay');

const COOKIE_OPTIONS = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
}

const loginHandler = (model) => async (req, res, next) => {
    await delay(200);
    const { email, password } = req.body;
    try {
        const user = await model.findOne({email}).select('+password');
        if (!user) {
            return responseReturn(res, 401, {error: 'Invalid email or password!'});
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return responseReturn(res, 401, {error: 'Invalid email or password!'});
        }
        const token = await createToken({
            id: user._id,
            role: user.role
        });
        res.cookie('accessToken', token, COOKIE_OPTIONS);
        responseReturn(res, 200, { message: 'Login success!' })
    } catch (error) {
        next(error);
    }
}
// End method


class authControllers {
    admin_login = loginHandler(adminModel);
    user_login = loginHandler(userModel);
    // End method
    user_register = async (req, res, next) => {
        const {email, name, password} = req.body;
        try {
            const getUser = await userModel.findOne({email});
            if (getUser) {
                return responseReturn(res, 409, {error: 'User already exists!'})
            } else {
                const user = await userModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                })
                const token = await createToken({
                    id: user._id,
                    role: user.role
                })
                res.cookie('accessToken', token, COOKIE_OPTIONS);
                responseReturn(res, 200, {message: 'Register success!'})
            }
        } catch (error) {
            next(error);
        }
    }
    // End method
    get_user = async (req, res, next) => {
        const {id, role} = req;
        try {
            if (role === 'admin') {
                const admin = await adminModel.findById(id);
                responseReturn(res, 200, {userInfo: admin})
            } else {
                const user = await userModel.findById(id);
                responseReturn(res, 200, {userInfo: user})
            }
        } catch (error) {
            next(error);
        }
    }
    // End method

    logout = async (req, res, next) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            responseReturn(res, 200, {message: 'Logout success!'})
        } catch (error) {
            next(error);
            
        }
    }
}
module.exports = new authControllers();