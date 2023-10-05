import express from 'express';
import connectDB from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcrypt';

import User from './models/User';

//Initialize Express Application
const app = express();
const port = 3001;

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//API Endpoints

/**
 * @route GET /
 * @desc Test endpoint
 */
app.get('/', (req, res) => {
    res.send('Hello World!');
});

/**
 * @route POST api/users
 * @desc Register user
 */
app.post(
    '/api/users',
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;

            try {
                let user = await User.findOne({ email: email });

                if (user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'User already exists' }] });
                }

                user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                //Encrypt password
                const salt = bcrypt.genSaltSync(10);
                user.password = await bcrypt.hash(password, salt);

                //Save to the db and return
                await user.save();

                res.status(201);
                res.send('User registered');

            }
            catch (err) {
                res.status(500);
                res.send('Server error');
                console.error(err.message);
            }
        }
    }
);

//Connection Listener
app.listen(port, () => console.log(`Express server running on port ${port}`));