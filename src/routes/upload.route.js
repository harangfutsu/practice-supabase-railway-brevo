const router = require("express").Router();
const uploadControllers = require("../controllers/upload.controller")
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/upload', authMiddleware.verifyToken, upload.single("file"), uploadControllers.uploadFile)

module.exports = router