var mysql = require('mysql');
var pool = mysql.createPool({
  connectTimeout  : 60*60*1000,
  acquireTimeout  : 60*60*1000,
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_kiblerke',
  password        : '5ql&&0r3g0n',
  database        : 'cs290_kiblerke'
});

module.exports.pool = pool;