const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Kindly go to /graphql to make queries!");
});

module.exports = router;