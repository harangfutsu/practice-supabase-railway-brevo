const router = require('express').Router()
const userControllers = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/users', userControllers.getAllUsers) 
router.put('/users/:userId', userControllers.updateUser)
router.delete('/users/:userId', userControllers.deleteUser)
router.get('/users/:userId', userControllers.getUserById)

router.post('/login', userControllers.loginUser)
router.post('/register', userControllers.createUser)
router.get('/verify-email', userControllers.verifyEmail)

module.exports = router