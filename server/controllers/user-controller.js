const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        try {
            const loggedInUser = await User.findOne({ _id: req.userId });
            console.log('loggedInUser=' + loggedInUser.email)
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    email: loggedInUser.email
                }
            }).send()
        } catch (err) {
        }
    })
}

loginUser = async (req, res) => {
    try {
        const enteredEmail = req.body.email
        const enteredPassword = req.body.password

        if (!enteredEmail || !enteredPassword) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields" })
        }

        const user = await User.findOne({ email: enteredEmail });
        const salt = await bcrypt.getSalt(user.passwordHash);
        const passwordHash = await bcrypt.hash(enteredPassword, salt);

        if (passwordHash == user.passwordHash) {
            console.log("logging in user: " + user.email)
            const token = auth.signToken(user);

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }).send();
        } else {
            return res.status(400)
                .json({
                    errorMessage: 'Password is invalid!'
                })
        }
    } catch (err) {
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    try {
        console.log('Logging out user!')
        return res.status(200).json({
            loggedIn: false,
            user: null
        }).send()
    } catch (err) {
        res.status(500).send()
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser
}