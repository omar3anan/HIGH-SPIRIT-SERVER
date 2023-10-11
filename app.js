const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json()); //middleware ==> use() ==> middleware for tour
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const musicRoutes = require("./routes/musicRoutes");
const userRoutes = require("./routes/userRoutes");
const tourRoutes = require("./routes/tourRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
// helemt is a package to set http headers
app.use(helmet());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());
//morgan is a package to log requests
app.use(morgan("dev"));

//to parse data from body to req.body
app.use(express.json());

const limitOptions = {
  max: 100, //100 max requests
  windowMs: 60 * 60 * 1000, //1 hour
  message: "Too many requests from this IP, please try again in an hour",
};
//limit the number of requests from the same IP
const limiter = rateLimiter(limitOptions);

app.use("/", limiter);
app.use("/music", musicRoutes);
app.use("/user", userRoutes);
app.use("/tours", tourRoutes);
app.use("/reviews", reviewRoutes);

module.exports = app;

//3andak kaza params ll req
// req.body
// req.headers.authentication
// req.params
// req.protocol
