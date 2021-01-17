const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var mongo = require('mongodb');
const {MONGODB_URI} = require('../utils/config')
var fs = require('fs');
const Grid = require('gridfs-stream');
const conn = mongoose.createConnection(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// Init gfs
let gfs;

// Storing the files in mongodb
conn.once('open', () => {

    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'resource'
    });
});
router.get('/:id', async (req, res) => {
    const obj_id = new mongoose.Types.ObjectId(req.params.id);


    gfs.find({ _id: obj_id }).toArray(function (err, files) {
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = files[0].contentType;
            var filename = files[0].filename;
            res.set('Content-Type', mime);
            res.set('Content-Disposition', "inline; filename=" + filename);
            var read_stream = gfs.openDownloadStream(obj_id);
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
    });


});





module.exports = router;