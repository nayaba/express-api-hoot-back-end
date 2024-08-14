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


module.exports = router