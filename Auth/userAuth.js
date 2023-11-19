const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const LocalStrategy = require('passport-local');

function PassportAuth(){
    return new LocalStrategy({ usernameField: 'email', passwordField: "password" }, async function (username, password, done) {
        await userModel.findOne({ email: username })
            .then((user) => {
                if (!user) {
                    console.log('err')
                    return done(null , false,{ status: 409, message: "Invalid email id" })
                } else if (bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { status: 409, message: "Invalid password" })
                }
            }).catch((err) => {
                return done(err)
            })

    });
}

function VerifyToken(token){
    let res = jwt.verify(token,  process.env.SECRET_KEY, (err, decode) => decode !== undefined ? decode : err);
    if (res instanceof Error) {
        return false;
    } else {
        return true;
    }
}

function GenerateToken(user){
    console.log("generate function called", user);
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1d' });
}

module.exports = {PassportAuth, VerifyToken , GenerateToken}