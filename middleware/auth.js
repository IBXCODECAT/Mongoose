import jwt from 'jwt';
import config from 'config';
import { config } from 'dotenv';

config();

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    const secret = process.env.JWT_SECRET;

    if(!token) return res.status(401).json({msg: 'No token, authorization denied'});

    try
    {
        const decodedToken = jwt.verify(token, secret);
        req.user = decodedToken.user;

        next();
    }
    catch(error)
    {
        res.status(401).json({msg: 'Token is not valid'});
    }
}

export default auth;