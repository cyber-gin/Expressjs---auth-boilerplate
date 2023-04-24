const JWT = require('jsonwebtoken');
require('dotenv').config();
let verifyToken = (token) => {
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
(async () => {
let token =await verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTEyMTU3NTlmYzM1YmIyY2VkMzM2MiIsImlhdCI6MTY3MTUwNTMwOSwiZXhwIjoxNzAzMDYyOTA5LCJhdWQiOiI2M2ExMjE1NzU5ZmMzNWJiMmNlZDMzNjIiLCJpc3MiOiJmb3JrbGVhZC5jb20ifQ.57VZLDwoS1LwwJfm3Sa7aG1Wk4tqfRuydQwG8crkqCw");
console.log(token);
})()