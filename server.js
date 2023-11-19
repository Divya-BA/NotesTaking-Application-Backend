const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const connectWithDB = require('./db');
const mongoose = require('mongoose');
const userRouter = require('./Router/userRouter');
const passport = require('passport');
const UserModel = require('./Models/userModel');
const {PassportAuth} = require('./Auth/userAuth');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
connectWithDB();

const store = new MongoDBStore({
    uri:process.env.DB_URL,
    collection: 'app_sessions'
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
// app.use(cors());
app.use(cors({
         origin:process.env.CLIENT_URL,
        credentials: true,
      }));




app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie:{
        maxAge:60000 * 4,
    },
    store: store,
    resave:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
    UserModel.findById(_id)
    .then(user => {
        done(null, user);
    })
    .catch(err => {
        done(err, null);
    });
});
passport.use(PassportAuth());
app.use('/api/v1',userRouter);

let port = process.env.PORT;
app.listen(port,()=>{
    console.log(`server is running on the ${port}`)
})