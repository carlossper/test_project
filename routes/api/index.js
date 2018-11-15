var router = require('express').Router();

router.use('/', require('./login'));
router.use('/logout', require('./login'));
router.use('/register', require('./register'));
router.use('/register_user', require('./register'));
router.use('/studies', require('./studies'));
router.use('/apis', require('./apis'));

module.exports = router;