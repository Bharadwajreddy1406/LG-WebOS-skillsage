const express = require('express');
const { getProjects } = require('./controller');
const router = express.Router();


router.get("/hello", (req, res) => {
    res.send("Hello World the DATA API is fine")
})

router.get("/academics")
router.get("/projects", getProjects)

module.exports = router;