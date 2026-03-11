const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

Category.getAllCategories = async function () {
  return this.find().sort({ name: 1 }).exec();
};

Category.initializeCategories = async function () {
  const defaultCategories = ["İş", "Okul", "Alışveriş", "Diğer"];
  for (const name of defaultCategories) {
    await this.findOneAndUpdate(
      { name: name },
      { name: name },
      { upsert: true }
    );
  }
};

module.exports = Category;
