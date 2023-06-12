const express = require("express");
const { UserModel } = require("../Models/user.model");
const router = express.Router();
var jwt = require("jsonwebtoken");
const axios = require("axios");
const { auth } = require("../Middleware/Auth.mw");
const redis = require("redis");
const { valid } = require("../Middleware/valid.mw");
const client = redis.createClient({
    password: 'JKMaRrigQxcumdMuENaQeuj3Gz3hc1pq',
    socket: {
        host: 'redis-17134.c99.us-east-1-4.ec2.cloud.redislabs.com',
        port: 17134
    }
});
client.connect();
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(label({ label: "right meow!" }), timestamp(), myFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
    ],
});
const loggerMW = (req, res, next) => {
    logger.info({ timestamp: new Date(), label: "INFO", level: "info", message: req.method });
    next();
}
router.use(loggerMW);
router.get("/", (req, res) => {
    res.send("This is the Home page");
});
router.post("/register", async (req, res) => {
    await UserModel.insertMany(req.body);
    res.send("User Registerd");
});
router.post("/login", async (req, res) => {
    const userdata = await UserModel.find({ email: req.body.email });
    if (userdata[0].password == req.body.password) {
        var token = jwt.sign({ userID: userdata[0]._id }, "shhhhh");
        res.send(token);
    } else {
        res.send("wrong!!!!");
    }
});
router.get("/current", valid, auth, async (req, res) => {
    const token = req.headers.authorization;
    var decoded = jwt.verify(token, "shhhhh");
    const data = await UserModel.findById(decoded.userID);
    const { city } = req.query || data.city;
    client.get(city).then((data) => {
        if (data) {
            res.send(data);
        } else {
            axios
                .get(
                    `http://api.weatherstack.com/current?access_key=2f31d00dc770c8f0f062046d893d9974&query=${city}`
                )
                .then(function (response) {
                    client.set(city, response.data.current.temperature);
                    client.expire(city, 1800);
                    res.send(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(404).send("error");
                });
        }
    });
});
module.exports = { router };
