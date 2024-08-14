const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')

const Hoot = require('../models/hoot')

// ========= Public Routes ==============

// ======== Protected Routes ============
router.use(verifyToken)

router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id
    const hoot = await Hoot.create(req.body)

    res.status(201).json(hoot)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/', async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })

    res.status(200).json(hoots)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/:hootId', async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate('author')
    res.status(200).json(hoot)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.put('/:hootId', async (req, res) => {
    try {

        // find the hoot by it's id
        const hoot = await Hoot.findById(req.params.hootId)
        
        // check if the author of the hoot is also the signed in user
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!")
        }
        
        // update the hoot
        const updatedHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId,
            req.body,
            { new: true }
        )
        
        res.status(200).json(updatedHoot)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:hootId', async (req, res) => {
    try {

        //  find the hoot we need to delete
        const hoot = await Hoot.findById(req.params.hootId)

        // check if the logged in user is the author
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!")
        }

        //  delete the hoot
        const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId)

        // respond with a status and the deleted hoot 

        res.status(200).json(deletedHoot)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post('/:hootId/comments', async(req, res) => {
    try {
        // add the author to the comment object aka req.body
        req.body.author = req.user._id
        console.log('req.body with author: ', req.body)

        // find the hoot that the comment will belong to
        const hoot = await Hoot.findById(req.params.hootId)

        // add the comment object (req.body) to the comments array on the Hoot
        hoot.comments.push(req.body)

        // after modifying the hoot, we need to save it
        await hoot.save()

        // find the newly created comment
        const newComment = hoot.comments[hoot.comments.length - 1]

        newComment._doc.author = req.user

        // res.status(201).json(hoot)
        res.status(201).json(newComment)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router


// banana = 66bc68bc56b6bdfd13b2842c
// hootId = 66bc68ed56b6bdfd13b2842e