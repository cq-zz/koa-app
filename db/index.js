const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '111',
    database: 'my_test'
});

const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(fields);
                        connection.release();
                    }
                })
            }
        })
    })
};

module.exports = query;