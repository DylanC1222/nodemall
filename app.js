const express = require("express");
const connect = require("./schemas");
const app = express();
const port = 3000;

connect();

const goodsRouter = require("./routes/goods");

const requestMiddleware = (req, res, next) => {
	console.log("Request URL:", req.originalUrl, " - ", new Date());
	next();
};

app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));
app.use(express.json());
app.use(requestMiddleware);

app.use("/api", [goodsRouter]);

app.get("/detail", (req, res) => {
	res.send("There's nothing here!");
});

app.get("/", (req, res) => {
	res.send("Whattup");
});

app.listen(port, () => console.log(port, "YABALABA"));
