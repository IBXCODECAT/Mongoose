import express from 'express';
import connectDB from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcrypt';
import auth from './middleware/auth';
import User from './models/User';
import jwt from 'jwt';

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

app.get('/api/auth', auth, async(req, res) => {
    try
    {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    }
    catch(error)
    {
        res.status(500).send('Server Error');
    }
});

app.post('/api/login', check('email').isEmail(), check('password').exists(), async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        const {email, password} = req.body;
        try
        {
            let user = await User.findOne({email: email});
            if(!user) {
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            const match = bcrypt.compare(password, user.password);

            if(!match) {
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            returnToken(user, res);
        }
        catch(err)
        {
            res.status(500).send('Server Error');
        }
    }
});

const returnToken = (user, res) => {
    const payload = {
        user: {
            id: user.id
        }
    }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '10hr' },
            (err, token) => {
                if(err) throw err;
                res.json({token: token});
            }
        )
    }

/**
 * @route POST api/users
 * @desc Register user
 */
app.post(
    '/api/register',
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

                returnToken(user, res);
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