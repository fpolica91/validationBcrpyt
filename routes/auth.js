const express = require("express");

const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const bcryptSalt = 10
var Recaptcha = require('express-recaptcha').RecaptchaV3;
//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha('SITE_KEY', 'SECRET_KEY');



router.get("/signup", (req, res, next) => {
    res.render("auth/signup", { captcha: res.recaptcha })
})

// THIS ROUTE IS USED TO CREATE A NEW USER
router.post("/signup", (req, res, next) => {
    // OBTAINING VALUES FROM FORM
    const username = req.body.username;
    const password = req.body.password;
    //     VALIDATE THAT THE USER HAS ENTERED AN EMAIL && PASSWORD
    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and passoword to signup"
        });
        return;
    }
    // TO AVOID DUPLICATES WE FIRST CHECK IF USERNAME IS VALID, IF IT IS NOT NULL THEN WE DNT CREATE
    User.findOne({ "username": username })
        .then(user => {
            // IF THE USERNAME IS NOT NULL RETURN
            if (user !== null) {
                res.render('auth/signup', {
                    errorMessage: "Username is already in use"
                })
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
            User.create({
                username,
                password: hashPass
            })
                .then(() => {
                    res.redirect("/")
                })
                .catch(err => {
                    console.log(err)
                })
        })
        // THIS IS THE END OF USER.FINDONE
        .catch(err => {
            console.log(err)
        })
})




module.exports = router;