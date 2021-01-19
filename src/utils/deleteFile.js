// To delete a file from the database 
const mongoose = require('mongoose');
const {MONGODB_URI}= require('./config')
const Grid = require('gridfs-stream');

const conn = mongoose.createConnection(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


let gfs;


conn.once('open', () => {

  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'resource'
  });
});

function deleteFile(id) {
  const obj_id = new mongoose.Types.ObjectId(id);
  gfs.delete(obj_id);
}
module.exports = deleteFile;