const bcrypt = require("bcrypt");
const User = require("./schema");
const express = require("express");
const bodyparser = require('body-parser');
const jwt = require("jsonwebtoken");
const app = express();
const auth = require("./auth");
const dbconnect = require("./dbconnect");

dbconnect();
app.use(bodyparser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.post("/login", (request, response) => {
    User.findOne({email: request.body.email})
    .then((user) => {
        bcrypt.compare(request.body.password, user.password)
        .then((passwordCheck) => {
            if (!passwordCheck){
                return response.status(400).send({
                    message: "Password does not match!",
                    error,
                });
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email,
                },
                "RANDOM-TOKEN",
                {
                    expiresIn: "24h"
                }
            );

            response.status(200).send({
                message: "Login Successful",
                email: user.email,
                token,
            })
        })
        .catch((error) => {
            response.status(400).send({
                message: "Password does not match",
                error,
            })
        })
    })
    .catch((e) => {
        response.status(404).send({
            message: "Email not found",
            e,
        })
    })
})

app.post("/register", (request, response) => {
    bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
        const user = new User({
            name : request.body.name,
            email: request.body.email,
            password: hashedPassword,
        });

        user
        .save()
        .then((result) => {
            response.status(201).send({
                message: "User Created Successfully",
                result,
            });
        })
        .catch((error) => {
            response.status(500).send({
                message: "Error creating user",
                error,
            });
        });
    })
    .catch((e) => {
        response.status(500).send({
            message: "Password was not hashed successfully",
            e,
        })
    })
});

app.get("/auth", auth, (request, response) => {
    response.json({user: request.user})
});

app.post("/user_details", auth,  (req, res) => {
    User.findOne({email: req.user.userEmail})
    .select({
        password: 0
    })
    .exec()
    .then((data) => {
        res.json(data)
    })
    .catch((error) => {
        res.status(404).send({
            message: "Email not found",
            e,
        })
    })
})
app.post("/update_user_details/:step", auth,  (req, res) => {
    if (req.params.step === "step_0"){
        User.findOneAndUpdate({email: req.body.email},
            {"basicDetails.link": req.body.link,
            "regProgress": 1
        }, {new: true})
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    else if(req.params.step === "step_1"){
        User.findOneAndUpdate({email: req.body.email},
            {"basicDetails.instagramLink": req.body.instagramLink,
            "basicDetails.twitterLink": req.body.instagramLink,
            "basicDetails.linkedINLink": req.body.instagramLink,
            "regProgress": 2
        })
        .then((data) => {
                res.json(data)
            })
        .catch((error) => {
            console.log(error);
        })

    }
    else{
        User.findOneAndUpdate({email: req.body.email},
            {"basicDetails.profileName": req.body.profileName,
            "basicDetails.profileBio": req.body.profileBio,
            "regProgress": 3
        })
        .then((data) => {
                res.json(data)
            })
        .catch((error) => {
            console.log(error);
        })
    }
})

app.listen(3000, () => console.log("running"))