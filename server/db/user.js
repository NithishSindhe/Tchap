//const mongoose = require("mongoose");
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'TchapDb'
});
connection.connect();

const check_mysql_user = (email) => {
    console.log(email)
    return false    
}

module.exports = {check_mysql_user};

