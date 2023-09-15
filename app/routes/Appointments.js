const router = require('express').Router();
const Appointments = require('../controllers/Appointments.js');

router
  .route('/')
  .get(Appointments.GET)
  .post(Appointments.POST)
  .put(Appointments.PUT)
  .delete(Appointments.DELETE);

module.exports = router;
