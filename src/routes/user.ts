import express from "express";
const user = require('../controller/UserController')
const router = express.Router();

router.post('/',user.createUser);

module.exports = router;
