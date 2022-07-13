const express = require("express");
const Carts = require("../schemas/carts");
const router = express.Router();
const Goods = require("../schemas/goods");

router.get("/carts", async (req, res) => {
	const carts = await Carts.find();
	const goods = await Goods.find({
		goodsId: carts.map((cart) => cart.goodsId),
	});

	res.json({
		carts: carts.map((cart) => {
			return {
				quantity: cart.quantity,
				goods: goods.find((item) => item.goodsId === cart.goodsId),
			};
		}),
	});
});

module.exports = router;
