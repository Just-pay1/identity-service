import express from "express";
const user = require('../controller/user')
const router = express.Router();

router.post('/',user.createUser);

module.exports = router;
