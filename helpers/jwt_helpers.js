const JWT = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {id:userId}
            const secret = process.env.ACCESS_TOKEN_SECRET
            //expires never
            const options = {
                expiresIn: '1y',
                issuer: 'forklead.com',
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err.message);
                    reject(err);
                }
                resolve(token);
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return res.status(401).send('Access Denied');
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return res.status(401).send(message);
            }
            req.payload = payload;
            next();
        })
    },
    signToken: (id) => {
        return new Promise((resolve, reject) => {
        let payload = {id:id}
        const secret = process.env.ACCESS_TOKEN_SECRET
        //expires never
        const options = {
            expiresIn: '1y',
            issuer: 'forklead.com',
            audience: id
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if(err){
                console.log(err.message);
                reject(err);
            }
            resolve(token);
        })
    })
    },
    verifyToken: (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
                if(err){
                    const message = err.name === 'JsonWebToken Error' ? 'Unauthorized' : err.message;
                    reject(message);
                }
                resolve(payload);
            })
        })
    }

}