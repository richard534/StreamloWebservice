var Track = require('../models/trackModel.js');
var mongoose = require('mongoose');
var fs = require('fs');
var grid = require('gridfs-stream');
var conn = mongoose.connection;
grid.mongo = mongoose.mongo;



exports.getTracksByTitle = function(req, res) {
    var trackTitle = req.query.q;
    var query = Track.find({ title : trackTitle });

    query.sort({numPlays: 'desc'})
        .limit(5)
        .exec(function(err, results){
            if(err)
                res.status(500).send(err);
            else
                res.json(results);
        });
};

exports.getNumberOfTracksByTitle = function(req, res) {
    var trackTitle = req.query.q;
    var query = Track.count({ title : trackTitle });

    query.exec(function(err, results){
            if(err)
                res.status(500).send(err);
            else
                res.json(results);
        });
};

exports.postTrack = function(req, res) {
    console.log(req.body);
    console.log(req.file);
    var fileName = req.body.title;
    var filePath = req.file.path;
    var filetype = req.file.mimetype;

    var gfs = grid(conn.db);

    // Streaming to gridfs
    // Filename to store in mongodb
    var writestream = gfs.createWriteStream({
        filename: fileName,
        content_type: 'audio/mp3'
    });
    fs.createReadStream(filePath).pipe(writestream);

    writestream.on('close', function (file) {
        console.log(file);
        var uploadedFileId = file._id;
        fs.unlink(filePath);
        console.log(file.filename + 'Written To DB');

        var entry = new Track({
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre,
            trackURL: req.body.trackURL,
            dateUploaded: req.body.dateUploaded,
            trackBinary: uploadedFileId
        });

        entry.save(function(err) {
            if(err){
                var errMsg = 'Error posting track ' + err;
                res.send(errMsg);
            } else {
                res.sendStatus(200);
            }
        });
    });



    /*

    var entry = new Track({
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        trackURL: req.body.trackURL,
        dateUploaded: req.body.dateUploaded
    });

    entry.save(function(err) {
        if(err){
            var errMsg = 'Error posting track ' + err;
            res.send(errMsg);
        } else {
            var gfs = grid(conn.db);

            // Streaming to gridfs
            // Filename to store in mongodb
            var writestream = gfs.createWriteStream({
                filename: fileName,
                content_type: 'audio/mp3'
            });
            fs.createReadStream(filePath).pipe(writestream);

            writestream.on('close', function (file) {
                console.log(file);
                fs.unlink(filePath);
                res.sendStatus(200);
                console.log(file.filename + 'Written To DB');
            });
        }
    });

    */




};

// TODO updating track name
exports.updateTrackTitleByTrackURL = function(req, res) {
    var trackURL = req.params.trackURL;
    var updatedTitle = req.body.title;
    var query = Track.update( { trackURL: trackURL}, { title: updatedTitle} );

    query.exec(function(err, results){
        if(err)
            res.status(500).send(err);
        else
            res.json("Track Title Updated");
    });
};

exports.deleteTrackByTrackURL = function(req, res) {
    var trackURL = req.params.trackURL;
    var query = Track.remove({ trackURL : trackURL });
    query.exec(function(err, results){
            if(err)
                res.status(500).send(err);
            else
                res.json("Track deleted");
        });
};

exports.addCommentByTrackByURL = function(req, res) {
    /*
    var comments = [];
    var com1 = { user: req.body.user, comment: req.body.comment, body: req.body.body }
    comments.push(com1);

    comments: [{
        user: req.body.user,
        comment: req.body.comment,
        body: req.body.body
    }]
    */
    var trackURL = req.params.trackURL;
};
