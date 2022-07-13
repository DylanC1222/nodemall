const express = require("express");
const Goods = require("../schemas/goods");
const Carts = require("../schemas/carts");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("This is the api root page");
});

router.get("/goods", async (req, res) => {
	const { category } = req.query;

	const goods = await Goods.find({ category });
	res.json({ goods });
});

router.get("/goods/cart", async (req, res) => {
	const carts = await Carts.find();
	const goods = await Goods.find({
		goodsId: carts.map((cart) => cart.goodsId),
	});

	res.json({
		cart: carts.map((cart) => {
			return {
				quantity: cart.quantity,
				goods: goods.find((item) => item.goodsId === cart.goodsId),
			};
		}),
	});
});

router.get("/goods/:goodsId", async (req, res) => {
	const { goodsId } = req.params;

	const [goods] = await Goods.find({ goodsId: Number(goodsId) });

	res.json({
		goods,
	});
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
	const { goodsId } = req.params;

	const existingCart = await Carts.find({ goodsId: Number(goodsId) });
	if (!existingCart.length) {
		return res
			.status(400)
			.json({ success: false, errorMessage: "Not in cart" });
	}

	await Carts.deleteOne({ goodsId: Number(goodsId) });
	res.json({ success: true });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
	const { goodsId } = req.params;
	const { quantity } = req.body;

	if (quantity < 1) {
		return res
			.status(400)
			.json({ success: false, errorMessage: "Quantity is less than 1" });
	}

	const existingCart = await Carts.find({ goodsId: Number(goodsId) });
	if (!existingCart.length) {
		await Carts.create({ goodsId: Number(goodsId), quantity });
	} else {
		await Carts.updateOne(
			{ goodsId: Number(goodsId) },
			{ $set: { quantity: Number(quantity) } }
		);
	}

	res.json({ success: true });
});

router.post("/goods", async (req, res) => {
	const { goodsId, name, thumbnailUrl, category, price } = req.body;

	const goods = await Goods.find({ goodsId });
	if (goods.length) {
		return res.status(400).json({
			success: false,
			errorMessage: "That item already exists",
		});
	}

	const createdGoods = await Goods.create({
		goodsId,
		name,
		thumbnailUrl,
		category,
		price,
	});

	res.json({ goods: createdGoods });
});

router.get("/carts", async (req, res) => {
	const carts = await Carts.find();
	const goods = await Goods.find({
		goodsId: carts.map((cart) => cart.goodsId),
	});

	res.json({
		cart: carts.map((cart) => {
			return {
				quantity: cart.quantity,
				goods: goods.find((item) => item.goodsId === cart.goodsId),
			};
		}),
	});
});

module.exports = router;

// Get, Post, Put, Delete input
// JSON/XAML output

// Create : POST
// Read: GET
// Update: PUT
// Delete: DELETE
