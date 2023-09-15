const router = require('express').Router();
const Users = require('../controllers/Users.js');

router
  .route('/')
  .get(Users.GET)
  .post(Users.POST)
  .put(Users.PUT)
  .delete(Users.DELETE);

module.exports = router;
