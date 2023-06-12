const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { router } = require('./Routes/server.routes');
app.use(express.json())
const rateLimit = require('express-rate-limit')
app.use("/", router);
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)
app.listen(8080, async () => {
    await mongoose.connect("mongodb+srv://laxya:laksh@cluster0.zwu6tqa.mongodb.net/weather?retryWrites=true&w=majority");
    console.log("Server Started......")
})