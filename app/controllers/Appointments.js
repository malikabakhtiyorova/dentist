const Appointments = require('../models/Appointments');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./Login');

module.exports = {
  GET:
    ('/',
    async (req, res) => {
      try {
        jwt.verify(req.headers.token, SECRET_KEY);
        res.json({
          code: 200,
          data: await Appointments.appointments(req),
          message: 'got successfully',
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }),
  POST:
    ('/',
    async (req, res) => {
      try {
        jwt.verify(req.headers.token, SECRET_KEY);
        res.json({
          code: 200,
          data: await Appointments.createAppointment(req.body),
          message: 'added successfully',
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }),
  PUT:
    ('/',
    async (req, res) => {
      try {
        jwt.verify(req.headers.token, SECRET_KEY);
        res.json({
          code: 200,
          data: await Appointments.updateAppointment(req.body),
          message: 'updated successfully',
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }),
  DELETE:
    ('/',
    async (req, res) => {
      try {
        jwt.verify(req.headers.token, SECRET_KEY);
        res.json({
          code: 200,
          data: await Appointments.deleteAppointment(req.body),
          message: 'deleted successfully',
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }),
};
