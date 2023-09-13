import express from 'express';
import connectDB from './config/db';
import { check, validationResult } from 'express-validator';

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
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            return res.status(201).send(req.body)   ;
        }
    }
);

//Connection Listener
app.listen(port, () => console.log(`Express server running on port ${port}`));