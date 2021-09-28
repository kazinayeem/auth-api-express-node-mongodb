const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userschema = require("../schemas/userschema");
const checklogin = require("../middleware/checklogin");
const router = express.Router();

const User = new mongoose.model("User", userschema);


router.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({
            message: "Signup was successful!",
        });

    } catch {
        res.status(500).json({
            message: "Signup failed!",
        });
    }
});


// user validedate route

// router.post("/signup", async (req, res) => {
//     const { name, username, password } = req.body;

//     try {
//         const hashpassword = await bcrypt.hash(req.body.password, 10);

//         const newuser = new User({
//             name,
//             username,
//             password: hashpassword
//         });
//         const userexit = await User.findOne({ username: username })
//         const usename = await User.findOne({ name: name })


//         if (userexit) {
//             return res.status(422).json({
//                 error: "user is  already exit"
//             })
//         }else if (usename){
//             return res.status(422).json({
//                 error: "name is  already exit"
//             })
//         }
//         await newuser.save();
//         res.status(200).json({
//             message: "user was insert singing successfull"
//         })

//     } catch {
//         res.status(500).json({
//             message: "singup failled"
//         });
//     }

// });

// log in router
router.post("/login", async (req, res) => {


    try {
        const user = await User.find({ username: req.body.username });

        if (user && user.length > 0) {
            const isvalidpassworld = await bcrypt.compare(req.body.password, user[0].password);
            if (isvalidpassworld) {

                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id

                }, process.env.JWT_SECRET, {
                    expiresIn: "7 days"
                });
                res.status(200).json({
                    "access_toden": token,
                    "message": "login successfull"
                })

            } else {
                res.status(401).json({
                    "error": "Authetication faild"
                })
            }

        } else {
            res.status(401).json({
                "error": "Authetication faild"
            })
        }
    } catch {
        res.status(401).json({
            "error": "Authetication faild"
        })
    }

})


router.get('/me', checklogin, (req, res) => {
    res.send(req.username);
})

module.exports = router;