const Joi = require('joi');
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Schema for login
const Loginschema = Joi.object({
    email:  Joi.string().email().required(),
    password: Joi.string().required(),
});
exports.Login = async (req, res) => {
    try {
        
        const inputData = req.body;
        const { error, value } = Loginschema.validate(inputData);

        if (error) {
            return res.status(422).send({ error: error.details[0].message })
        }

        await User.findOne({ email: value.email }).then(async (user) => {
        await bcrypt.compare(value.password, user.password).then((bc) => {
            if (bc) {
              const payload = {
                user: {
                  id: user.id,
                },
              };
              const authToken = jwt.sign(payload, JWT_SECRET);
              res.status(200).send({
                        success: "true",
                        userauthToken: authToken,
                        userId: user.id,
                    });
            } else {
              res
                .status(401)
                .send({ success: "false", msg: "Authentification failed" });
            }
          })
          .catch((err) => {
            res.status(401).send({ error: err });
          });
      })
      .catch((err) => {
        res.status(401).send({ error: err });
      });
    } catch (error) {
        return res.status(500).send({
            "err": err
        })
    }
}

// Schema for Signin
const SignInschema = Joi.object({
    email:  Joi.string().email().required(),
    password: Joi.string().required(),
});

exports.SignIn = async (req, res) => {
    try {
        console.log("HEllo");
        const inputData = req.body;
        const { error, value } = SignInschema.validate(inputData);

        if (error) {
            return res.status(422).send({ error: error.details[0].message })
        }
        const salt = await bcrypt.genSalt(10);
        const secured_password = await bcrypt.hash(value.password, salt);
        await User.create({
            email : value.email,
            password : secured_password
        }).then(async (user)=>{
            res.status(200).send({ "success": true });
        }).catch(err=>{
            return res.status(402).send({
                err : "Something went wrong"
            })
        })
    } catch (err) {
        return res.status(500).send({
            "err": err
        })
    }
}