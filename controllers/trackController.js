var Track = require('../models/trackModel.js');

exports.getTracksByTitle = function(req, res) {
    var trackTitle = req.query.q;
    var query = Track.find({ title : trackTitle });

    query.sort({numPlays: 'desc'})
        .limit(10)
        .exec(function(err, results){
            if(err)
                res.status(500).send(err);
            else
                res.json(results);
        });
};

exports.postTrack = function(req, res) {
    var entry = new Track({
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        trackURL: req.body.trackURL,
        tags: req.body.tags,
        numPlays: req.body.numPlays,
        numLikes: req.body.numLikes,
        dateUploaded: req.body.dateUploaded,
        //track: ,
        comments: req.body.comments
    });

    entry.save(function(err) {
        if(err){
            var errMsg = 'Error posting track ' + err;
            res.send(errMsg);
        } else {
            res.redirect(301, '/');
        }
    });
};
