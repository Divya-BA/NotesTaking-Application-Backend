const UserModel = require('../Models/userModel');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { GenerateToken, VerifyToken } = require('../Auth/userAuth');
const jwt = require('jsonwebtoken');


function RegisterUser(req, res) {
    console.log(req.body)
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: req.body.email }).then((data) => {
            if (data) {
                reject({ status: 409, message: 'user with specific email already exists' });
            } else {
                console.log("it reaches else part")
                let newUser = new UserModel({
                    _id: uuidv4(),
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10),
                });
                newUser.save().then((data) => {
                const token = GenerateToken({user:data._id});
                if(token){
                    console.log(token,'it reaches resolve part')
                    resolve({ status: 200, message: 'user regster successfully', data:{data,token}})
                }else{
                    console.log('token genearted failed')
                }
                 
            
                }).catch((err) => {
                    reject(err)
                })
            }
        })
    })
}

function LoginUser(req, res) {
    return new Promise((resolve, reject) => {
        if (!req.session.passport) {
            reject({ status: 401, message: "Unauthorized" });
            return;
        }

        const userId = req.session.passport;
        if (!userId) {
            reject({ status: 500, message: "Token generation failed" });
            return;
        }

        const token = GenerateToken(userId);
        if (!token) {
            reject({ status: 500, message: "Token generation failed" });
            return;
        }

        resolve({ token })
    })
}

function IsAuthenticated(req, res) {
    console.log(req.headers.authorization)
    return new Promise((resolve, reject) => {
        if (!req.headers.authorization) {
            reject({ status: 401, message: "Token Invalid" });
            return
        }

        const header = req.headers.authorization;

        resolve({ isAuthenticated: VerifyToken(header) })
    })

}

function GetUsers(req, res) {
    return new Promise((resolve, reject) => {
        const token = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        console.log(token);
        UserModel.findById(token.user).then((data) => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })


    })
}


const ForgotPassword = (req, res) => {
  return new Promise((resolve, reject) => {
    const { email } = req.body;
    UserModel.findOne({ email: email })
      .then((user) => {
        if (!user) {
          reject({ status: 404, message: 'User not found' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        var transporter = nodemailer.createTransport({
          service: process.env.SERVICE,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
          },
        });

        var mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: 'Reset Password Link',
          text: `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            reject({ status: 500, message: 'Error sending reset password email' });
          } else {
            resolve({ status: 200, message: 'Success' });
          }
        });
      })
      .catch((error) => {
        reject({ status: 500, message: 'Error with token or updating password' });
      });
  });
};

const ResetPassword = (req, res) => {
  return new Promise((resolve, reject) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hash = bcrypt.hashSync(password, 10);
      UserModel.findByIdAndUpdate({ _id: id }, { password: hash })
        .then((updatedUser) => {
          if (!updatedUser) {
            reject({ status: 404, message: 'User not found' });
          }
          resolve({ status: 200, message: 'Success' });
        })
        .catch((err) => {
          reject({ status: 500, message: 'Error with token or updating password' });
        });
    } catch (err) {
      reject({ status: 500, message: 'Error with token or updating password' });
    }
  });
};

  

module.exports = { RegisterUser, LoginUser, IsAuthenticated , GetUsers,ResetPassword,ForgotPassword};