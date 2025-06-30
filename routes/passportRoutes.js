// routes/passportRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/passportController');

router.route('/')
  .get(ctrl.getPassports)
  .post(ctrl.createPassport);

router.route('/:id')
  .get(ctrl.getPassportById)
  .put(ctrl.updatePassport)
  .delete(ctrl.deletePassport);

module.exports = router;
