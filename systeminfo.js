var os = require('os');
var disk = require('diskusage');

var method = Systeminfo.prototype;
function Systeminfo(){}

method.getCpuInfo = function () {
	return os.cpus();
};

method.getDiskInfo = function() {
	var ret = null;
	disk.check('/', function(err, info) {
		ret = info;
	});
	// Warning: we're breaking async here
	while(!ret){};
	return ret;
};

method.getLoad = function() {
 	return os.loadavg()
};

method.getMemoryInfo = function (){
	return {"total": os.totalmem(), "free": os.freemem(), "used": os.totalmem()-os.freemem()};
};

method.getUptime = function (){
	return{"uptime": os.uptime()}
};

method.getAll = function() {
	return {
		"disk": this.getDiskInfo(),
		"load": this.getLoad(),
		"cpu": this.getCpuInfo(),
		"memory": this.getMemoryInfo(),
		"uptime": this.getUptime()
	};
}

module.exports = Systeminfo;