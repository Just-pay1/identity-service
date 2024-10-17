import express from "express";
const card = require('../controller/CardController')
const router = express.Router();

router.post('/',card.createCard);
module.exports = router;