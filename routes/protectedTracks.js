var express = require('express');
var protectedTrackRoutes = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var trackController = require('../controllers/trackController.js');
var jwtUtils = require('../utils/jwt');

// Binding JWT verify middleware to protected routes
protectedTrackRoutes.use(jwtUtils.verifyToken);

// POST track to the system
protectedTrackRoutes.post('/', upload.single('track'), function(req, res) {
  return trackController.postTrack(req, res);
});

// Add comment to track by trackURL
protectedTrackRoutes.post('/:trackURL/addComment', function(req, res) {
  return trackController.addCommentToTrackByTrackURL(req, res);
});

// Add desciption to track by trackURL
// TODO check if user has permission
protectedTrackRoutes.post('/:trackURL/addDescription', function(req, res) {
  //return trackController.addCommentToTrackByTrackURL(req, res);
});

// TODO check if user has permission
protectedTrackRoutes.patch('/:trackURL', function(req, res) {
  return trackController.updateTrackTitleByTrackURL(req, res);
});

// TODO check if user has permission
protectedTrackRoutes.delete('/:trackURL', function(req, res) {
  return trackController.deleteTrackByTrackURL(req, res);
});

module.exports = protectedTrackRoutes;
