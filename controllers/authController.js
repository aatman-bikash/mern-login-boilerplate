const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleErrors = (err) => {
    const errors = {
        email: '',
        password: ''
    };
    console.log(err);
    if (err.message === 'Incorrect Email') {
        errors.email = 'Incorrect Email';
    }
    if (err.message === 'Incorrect Password') {
        errors.password = 'Incorrect Password';
    }
    if (err.code === 11000) {
        errors.email = 'Email already exists';
    }
    if (err._message === 'User validation failed') {
        errors.email = err.errors.email ? err.errors.email.properties.message : '';
        errors.password = err.errors.password ? err.errors.password.properties.message : '';
    }
    return errors;
};

const returnSignupPage = (req, res) => {
    res.render('signup');
};

const returnLoginPage = (req, res) => {
    res.render('login');
};

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        // Access Token
        const token = jwt.sign({
            user: user._id
        }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ user });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(500).json({ errors });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if email exists or not
        const user = await User.findOne({ email });
        if (user) {
            // check password match
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({
                    user: user._id
                }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                });
                res.json({ user });
            } else {
                throw Error('Incorrect Password');
            }
        } else {
            throw Error('Incorrect Email');
        }
    } catch (error) {
        const errors = handleErrors(error);
        res.status(500).json({ errors });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
};

module.exports = {
    returnSignupPage,
    returnLoginPage,
    createUser,
    loginUser,
    logoutUser
};