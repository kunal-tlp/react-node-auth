const db = require('../config/db')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

var User = function (data) {

}

User.signupDetails = async function (postdata) {
    return new Promise(async function (resolve, reject) {
        let hashedPassword = await bcrypt.hash(postdata.password, 8);
        var insertData = {
            firstname: postdata.firstname ? postdata.firstname : "",
            lastname: postdata.lastname ? postdata.lastname : "",
            email: postdata.email ? postdata.email : "",
            password: hashedPassword ? hashedPassword : "",
            status: postdata.status ? postdata.status : "",
        }
        var queryinsert = "insert into ps_backend set ?";
        db.query(queryinsert, insertData, function (err, res) {
            if (err) {
                return reject(err)
            } else {
                // console.log("res", res)
                return resolve(res)
            }
        })
    });
}

User.loginDetails = async function (postdata) {
    return new Promise((resolve, reject) => {
        var queryselect = "SELECT * FROM ps_backend WHERE email = ?";
        var filter = [postdata.email];
        db.query(queryselect, filter, function (err, res) {
            if (err) {
                console.log("err", err)
                return reject(err)
            } else {
                if (res.length === 0) {
                    return resolve(null);
                }
                const userData = res[0];
                bcrypt.compare(
                    postdata.password,
                    userData.password,
                    function (bcryptErr, bcryptRes) {
                        if (bcryptErr) {
                            console.log("bcryptErr", bcryptErr)
                            return reject(bcryptErr)
                        } else if (bcryptRes) {
                            return resolve(userData);
                        } else {
                            return resolve(null);
                        }
                    }
                );
            }
        });
    });
}

User.sessionToken = async (data) => {
    return new Promise((resolve, reject) => {
        var tokenData = { id: data.id, email: data.email, password: data.password };
        var token = jwt.sign(
            { tokenData },
            "MYSECRETKEY",
            { algorithm: "HS256" }
        );
        data.token = token;
        var queryinsert = `UPDATE ps_backend SET token = ? WHERE id = '${data.id}'`;
        var filter = [data.token];
        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                return reject(err)
            } else {
                // res.cookie('token', token)
                return resolve(res)
            }
        });
    });
}

User.logout = async function (postdata) {
    return new Promise((resolve, reject) => {
        if (!postdata || !postdata.token) {
            return reject("Authorization token is mission")
        }

        var token = postdata.token;
        var queryinsert = `SELECT * FROM ps_backend WHERE token = ?`;
        var filter = [token];

        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                console.log("err", err);
                return reject(err);
            } else {
                return resolve(res);
            }
        });
    });
}

User.logoutUserData = async function (postdata) {
    return new Promise((resolve, reject) => {
        if (!postdata || !postdata.id) {
            return reject("User ID is missing");
        }

        const userID = postdata.id;
        const queryinsert = "UPDATE ps_backend SET token = NULL WHERE id = ?";
        const filter = [userID];

        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                console.log("err", err)
                return reject(err)
            } else {
                return resolve(res)
            }
        });
    });
}

module.exports = User;
