import UserController from '../../src/controllers/UserController';
import bodyParser from 'body-parser';
import express from 'express';

const urlEncodeParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// get
// Use arrow functions in controller class methods to perserve `this` context
router.get('/', UserController.auth, (req, res) => {
  UserController.find(req, res);
});

// get by id
router.get('/:id', UserController.auth, (req, res) => {
  UserController.find(req, res);
});

// create
router.post('/:id', UserController.auth, urlEncodeParser, (req, res) => {
  UserController.create(req, res);
});

// update
router.put('/:id', UserController.auth, urlEncodeParser, (req, res) => {
  UserController.update(req, res);
});

// delete
router.delete('/:id', UserController.auth, urlEncodeParser, (req, res) => {
  UserController.remove(req, res);
});

export default router;
