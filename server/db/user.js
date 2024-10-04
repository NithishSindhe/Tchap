//const mongoose = require("mongoose");
var mysql = require('mysql');

var db_connect_info = {
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'TchapDb'
    }

const run_query_command = command => {
    return new Promise( (resolve,reject) => {
        var connection = mysql.createConnection(db_connect_info);
        connection.query(command,(error,results,_fields) => {
            if(error) return reject(error)
            console.log(results)
            return resolve(results)
        })
        connection.end((err) => {
            if (err) {
                console.log('Error while closing the connection:', err);
            } else {
                console.log('Database connection closed successfully.');
            }
        });
    })
}

const check_email_existence = (email) => {
    return new Promise( (resolve,reject) => {
        command = `SELECT email FROM user_identity WHERE email = '${email}';`
        var connection = mysql.createConnection(db_connect_info);
        connection.connect((err) => {
            if(err) return reject(err);
            run_query_command(command)
                .then(response => {
                    if(response.length == 0) {
                        return resolve(false)
                    }
                    return resolve(true);
                })
                .catch(errors => reject(errors))
            //email_bool = connection.query(query_command, (error,results,fields) => {
            //    if(error) throw error;
            //    if(results.length == 0) return false
            //    return true // return true if email exists in db 
            //})
            //console.log('email bool:',email_bool)
        });
    })
    command = `SELECT email FROM user_identity WHERE email = '${email}';`
    var connection = mysql.createConnection(db_connect_info);
    connection.connect((err) => {
        if(err) throw err;
        run_query_command(command)
            .then(response => {
                if(response.length == 0) {
                    console.log('promise resolved as false')
                    return false
                }
                console.log('promise resolved as true')
                return true
            })
            .catch(errors => console.log('error occured:',errors))
        //email_bool = connection.query(query_command, (error,results,fields) => {
        //    if(error) throw error;
        //    if(results.length == 0) return false
        //    return true // return true if email exists in db 
        //})
        //console.log('email bool:',email_bool)
    });
    console.log('returning default false for check email existance')
    return false // safe to not allow registration in case something goes wrong
}

const get_user_info = (email) => {
    command = `SELECT * FROM user_identity where email = '?'`
    params = [email]
    var connection = mysql.createConnection(db_connect_info)
    connection.connect( err => {
        if(err) throw err
        connection.query(command, params, (error,results,_fields) => {
            if(error) throw error
            console.log('got user info: ',results)
        });
        connection.end((err) => {
            if (err) {
                console.log('Error while closing the connection:', err);
            } else {
                console.log('Database connection closed successfully.');
            }
        });
    })    
}

const create_mysql_user = (username, password, email, phone) => {
    get_user_info(email)
    command = `INSERT INTO user_identity (userName, phoneNumber, password, email) VALUES (?,?,?,?);`
    if(phone == null) command = command = `INSERT INTO user_identity (userName, phoneNumber, password, email) VALUES ("${username}", ${phone}, "${password}", "${email}");`
    params = [username, phone, password, email]
    var connection = mysql.createConnection(db_connect_info);
    connection.connect((err) => {
        if(err){
            console.log('There was some error trying to connect to database')
            throw err
        }
        connection.query(command, params, (error,response,_fields) => {
            console.log('create new user promise resolved')
            if(error) throw new Error({name:'Error creating new user:', message:error})
            console.log('created new user. Response:',response)
        });
        connection.end((err) => {
            if (err) {
                console.log('Error while closing the connection:', err);
            } else {
                console.log('Database connection closed successfully.');
            }
        });
    })
}

module.exports = {check_email_existence, create_mysql_user, get_user_info};

