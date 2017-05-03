var os = require('os-utils');
var disk = require('diskusage');
var mysql = require('mysql');

const HOST_NAME = 'jerico-03'

var method = Systeminfo.prototype;

var DEBUG = true;

const consoleLogBackup = console.log;
const log = (...args) => DEBUG && consoleLogBackup(...args);

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://192.168.16.116:27017/monitoring';


var connection = mysql.createConnection({
    host: '192.168.16.118',
    user: 'webscript',
    password: 'secret',
    database: 'nova'
});

function Systeminfo() { }

method.updateMongoDB = function (callback) {
    log("Execute getTestInfo!");
    os.cpuUsage((cpu_usage) => {
        log("We have the cpu_usage: ", cpu_usage);
        var free_mem = os.freemem();
        log("We have the free_mem: ", free_mem);
        //connection.connect();
        connection.query("SELECT host, count(*) from instances where power_state = 1 and host like '" + HOST_NAME + "' group by host", (error, result, fields) => {
            log("Error: ", error);
            if (result[0]) {
                log("instances: ", result[0]['count(*)']);
                log("fields ", fields);
                var instances = result[0]['count(*)'];
            } else {
                var instances = 0;
            }
            MongoClient.connect(url, (err, db) => {
                assert.equal(null, err);
                insertDocument(db, cpu_usage, free_mem, instances, () => {
                    db.close();
                    callback({
                        "cpu_usage": cpu_usage,
                        "free_mem": free_mem,
                        "instances": instances,
                        "timestamp": new Date()
                    });
                });
            });
        });
        //connection.end();
    })
}

var insertDocument = function (db, cpu_usage, free_mem, instances, callback) {
    db.collection(HOST_NAME.replace('-', '')).insertOne({
        "cpu_usage": cpu_usage,
        "free_mem": free_mem,
        "instances": instances,
        "timestamp": new Date()
    }, function (err, result) {
        assert.equal(err, null);
        log("Inserted a document into the collection.");
        callback();
    });
}

method.getPeriodStats = function (start, end, callback) {
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        var complete_result = {};
        complete_result["jerico-01 CPU"] = [];
        complete_result["jerico-01 Memory"] = [];
        complete_result["jerico-01 Instances"] = [];
        complete_result["jerico-02 CPU"] = [];
        complete_result["jerico-02 Memory"] = [];
        complete_result["jerico-02 Instances"] = [];
        complete_result["jerico-03 CPU"] = [];
        complete_result["jerico-03 Memory"] = [];
        complete_result["jerico-03 Instances"] = [];
        var cursor = db.collection('jerico01').find({ "timestamp": { $gt: new Date(start), $lt: new Date(end) } });
        //var result = [];
        cursor.each(function (err, doc) {
            if (doc != null) {
                complete_result["jerico-01 CPU"].push(doc.cpu_usage);
                complete_result["jerico-01 Memory"].push(doc.free_mem);
                complete_result["jerico-01 Instances"].push(doc.instances);
                //result.push(doc);
            } else {
                //complete_result["jerico-01"] = result;
                //result = [];
                cursor = db.collection('jerico02').find({ "timestamp": { $gt: new Date(start), $lt: new Date(end) } });
                cursor.each(function (err, doc) {
                    if (doc != null) {
                        complete_result["jerico-02 CPU"].push(doc.cpu_usage);
                        complete_result["jerico-02 Memory"].push(doc.free_mem);
                        complete_result["jerico-02 Instances"].push(doc.instances);
                        //result.push(doc);
                    } else {
                        //complete_result["jerico-02"] = result;
                        //result = [];
                        cursor = db.collection('jerico03').find({ "timestamp": { $gt: new Date(start), $lt: new Date(end) } });
                        cursor.each(function (err, doc) {
                            if (doc != null) {
                                complete_result["jerico-03 CPU"].push(doc.cpu_usage);
                                complete_result["jerico-03 Memory"].push(doc.free_mem);
                                complete_result["jerico-03 Instances"].push(doc.instances);
                                //result.push(doc);
                            } else {
                                //complete_result["jerico-03"] = result;
                                db.close();
                                callback(complete_result);
                            }
                        });
                    }
                });
            }
        });
    });
}

method.getMonitorInfo = function (callback) {
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        var cursor = db.collection(HOST_NAME.replace('-', '')).find();
        var result = [];
        cursor.each(function (err, doc) {
            if (doc != null) {
                result.push(doc);
            } else {
                db.close();
                callback(result);
            }
        });
    });
}
module.exports = Systeminfo;