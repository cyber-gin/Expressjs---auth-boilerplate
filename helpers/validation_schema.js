const Joi = require("@hapi/joi");

const authSchema = Joi.object({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(6).max(20).required(),
    
})

module.exports = {
    authSchema
}