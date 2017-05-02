var os = require('os');
var disk = require('diskusage');
var mysql = require('mysql2');

var resultOfInstances = false;

var method = Systeminfo.prototype;

var connection = mysql.createConnection({
	host: '192.168.16.118',
	user: 'webscript',
	password: 'secret',
	database: 'nova'
});

function Systeminfo() { }

method.getCpuInfo = function () {
	return os.cpus();
};

method.getInstances = function () {
	connection.connect();
	var res = null;
	res = connection.query('SELECT host, count(*) from instances where power_state = 1 group by host', function (error, results, fields) {
		if (error) {
			console.log("Instances not retreived!");
			throw error;
		}
		console.log("Results: ", results);
		console.log("Fields: ", fields);
		return result;
	});
	console.log(res);
	connection.queryAsync
	connection.end();
	while (!res) { };
	return res;
}

method.getDiskInfo = function () {
	var ret = null;
	disk.check('/', function (err, info) {
		ret = info;
	});
	// Warning: we're breaking async here
	while (!ret) { };
	return ret;
};

method.getLoad = function () {
	return os.loadavg()
};

method.getMemoryInfo = function () {
	return { "total": os.totalmem(), "free": os.freemem(), "used": os.totalmem() - os.freemem() };
};

method.getUptime = function () {
	return { "uptime": os.uptime() }
};

method.getTestInfo = function () {
	return {
		"instances": this.getInstances(),
		"load": this.getLoad(),
		"cpu": this.getCpuInfo(),
		"memory": this.getMemoryInfo()
	};
}

method.getAll = function () {
	return {
		"disk": this.getDiskInfo(),
		"load": this.getLoad(),
		"cpu": this.getCpuInfo(),
		"memory": this.getMemoryInfo(),
		"uptime": this.getUptime()
	};
}

module.exports = Systeminfo;