const db = require('../config/db')
const authModel = require('../models/authModel')

exports.signupDetails = async function (req, res) {
    try {
        db.beginTransaction()
        var details = await authModel.signupDetails(req.body);
        if (details) {
            db.commit();
            res.status(200).json({ message: "Data insert successfull..", Data: req.body })
        } else {
            db.rollback();
            res.status(404).json({ message: "Error in inserted task details" })
        }
    } catch (error) {
        // console.log(error)
        db.rollback()
        res.status(500).json({ message: "rollback error" })
    }
}

exports.loginDetails = async function (req, res) {
    try {
        db.beginTransaction()
        var loginData = await authModel.loginDetails(req.body);
        if (loginData != undefined) {
            var generateToken = authModel.sessionToken(loginData);

            db.commit();
            res.json({ message: "User Login Successfull", UserData: loginData })
        } else {
            db.rollback();
            res.status(401).json({ message: "Data Error" })
        }
    } catch (error) {
        db.rollback()
        res.status(401).json({ message: "rollback error" })
    }
}

exports.logoutData = async (req, res) => {
    try {
        db.beginTransaction();
        var logoutData = await authModel.logout(req.headers);
        const logoutDataValue = logoutData[0];

        if (logoutDataValue) {
            var logoutUser = await authModel.logoutUserData(logoutDataValue);
            db.commit();
            res.status(200).json({message: "User Logout Successfull", logoutUser})
        } else {
            db.rollback()
            res.status(401).json({message: "Data Error"})
        }
    } catch (error) {
        db.rollback()
        res.status(401).json({message: "rollback error"})
    }
}
