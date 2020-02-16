import EventController from '../../src/controllers/EventController';
import UserController from '../../src/controllers/UserController';
import bodyParser from 'body-parser';
import express from 'express';

const urlEncodeParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// get
router.get('/', (req, res) => {
  EventController.find(req, res);
});

// get by id
router.get('/:id', (req, res) => {
  EventController.find(req, res);
});

// create
router.post('/:id', UserController.auth, urlEncodeParser, (req, res) => {
  EventController.create(req, res);
});

// update
router.put('/:id', UserController.auth, urlEncodeParser, (req, res) => {
  EventController.update(req, res);
});

// delete
router.delete('/:id', UserController.auth, urlEncodeParser, (req, res) => {
  EventController.remove(req, res);
});

export default router;
