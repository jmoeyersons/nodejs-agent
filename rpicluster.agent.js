const AGENT_PORT=8081; 

var express = require("express");
var app = express();
var router = express.Router();

var Systeminfo = require('./systeminfo_async');

router.use(function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

function handleRequest(request, response){
    try {
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

/*//ping
router.get("/ping",function(req,res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('1');
});

//info
router.get("/info",function(req,res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new Systeminfo().getAll()));
});*/

//info/openstack
router.get("/openstack", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    new Systeminfo().getMonitorInfo(function(result) {
        res.end(JSON.stringify(result));
    });
})

router.get("/mongodb", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    new Systeminfo().updateMongoDB(function(result) {
        res.end(result);
    });
})


/*//info/disk
router.get("/info/disk",function(req,res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new Systeminfo().getDiskInfo()));
});


//info/load
router.get("/info/load",function(req,res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new Systeminfo().getLoad()));
});

//info.cpu
router.get("/info/cpu", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new Systeminfo().getCpuInfo()));
});

//info.memory
router.get("/info/memory", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new Systeminfo().getMemoryInfo()));
});

//info.uptime
router.get("/info/uptime", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new Systeminfo().getUptime()));
});*/


app.use("/",router);
app.use("*",function(req,res){
  res.end();
});

app.listen(AGENT_PORT,function(){
    console.log("Agent ready, listening on: http://localhost:%s", AGENT_PORT);
});