const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoschema = require("../schemas/todoschemas")
const userschema = require("../schemas/userschema")
const checklogin = require("../middleware/checklogin")


const Todo = new mongoose.model("Todo", todoschema);
const User = new mongoose.model("User", userschema);

// get all todos
router.get('/', checklogin, (req, res) => {

    Todo.find({}).populate("user", "name , username -_id")
        .exec(
            (err, data) => {
                if (err) {
                    res.status(500).json({

                        error: "not show data please check your code",
                    })
                } else {
                    res.status(200).json({
                        result: data,
                        message: "todo get successfull"
                    })
                }
            }
        )


})

// get toso by filter 
router.get('/alltodos',checklogin ,(req, res) => {
    const search = req.query.status
    const page = parseInt(req.query.page)
    const user = parseInt(req.query.user)
    Todo.find({ status: search }).select({
        _id: 0,
        _v: 0,

    })
        .limit(page)
        .exec(
            (err, data) => {
                if (err) {
                    res.status(500).json({

                        error: "not show data please check your code",
                    })
                } else {
                    const lenght = data.length
                    if (page === lenght) {
                        res.status(200).json({

                            "lenght": lenght,
                            "data": data
                        })
                    } else {
                        res.status(200).json({
                            "data": `${page} data is not found`
                        })
                    }
                }
            }
        )

})

// get a todo
router.get('/:id', async (req, res) => {
    await Todo.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({

                error: "not show data please check your code",
            })
        } else {
            res.status(200).json({
                result: data,
                message: "todo get successfull"
            })
        }
    })


})

// post a todo
router.post('/', checklogin, async (req, res) => {

    const newtodo = new Todo({
        ...req.body,
        // user: req.userId
    });

    try {

        await newtodo.save()

        res.status(200).json({
            error: "todo was insert successfull"
        })

    } catch {
        res.status(500).json({
            error: "there was an server singh error"
        })
    }



});

// post multiple todos
router.post('/all', (req, res) => {

    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "there was an server singh error"
            })
        } else {
            res.status(200).json({
                error: "todo were insert m successfull"
            })
        }
    })


})

// put todo
router.put('/', async (req, res) => {

})

// delete todo
router.delete('/:id', (req, res) => {
    Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({

                error: "there was an server singh error",
            })
        } else {
            res.status(200).json({

                message: "todo delete successfull"
            })
        }
    })

})

module.exports = router;