const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
	goodsId: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
		unique: true,
	},
	thumbnailUrl: {
		type: String,
	},
	category: {
		type: String,
	},
	price: {
		type: Number,
	},
});

const model = mongoose.model("Goods", goodsSchema);

module.exports = model;
