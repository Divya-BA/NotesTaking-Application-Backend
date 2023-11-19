const repo = require('../Repository/userRepo');
const {VerifyToken} =require('../Auth/userAuth');

function registerUser(req,res){
    repo.RegisterUser(req).then(data => {
      res.status(200).send(data);
      }).catch((err)=>{
             res.status(404).send(err)
  })
}

function loginUser(req,res){
    repo.LoginUser(req).then(data =>{
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    })
}
function forgotPassword(req,res){
    repo.ForgotPassword(req).then(data =>{
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    })
}

function resetPassword(req,res){
    repo.ResetPassword(req).then(data =>{
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    })
}

function authenticated(req,res){
    repo.IsAuthenticated(req).then(data=>{
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    })
}

function getUsers(req,res){
    repo.GetUsers(req).then(data=>{
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    })
}

function VerifyTokenMiddleware(req, res, next) {
    if (VerifyToken(req.headers.authorization) === true) {
        next();
    } else {
        res.status(401).send({ status: 401, message: "You are not authorized" });
    }
}
module.exports = {registerUser , loginUser,forgotPassword,resetPassword, authenticated, getUsers, VerifyTokenMiddleware}