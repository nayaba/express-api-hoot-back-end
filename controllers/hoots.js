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

        // check if the logged in user is the author

        //  delete the hoot

        // respond with a status and the deleted hoot 


    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router


// banana = 66bc68bc56b6bdfd13b2842c
// hootId = 66bc68ed56b6bdfd13b2842e