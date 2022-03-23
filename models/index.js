// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// One to Many relationship
Product.belongsTo(Category,{
  foreignKey:'categoryId',
  onDelete:'CASCADE'
})

Category.hasMany(Product,{
  foreignKey:'categoryId'
})

// Many to Many relationship
Product.belongsToMany(Tag,{ 
  through:{model:ProductTag},
  onDelete:'CASCADE'
})

Tag.belongsToMany(Product,{ 
  through:{model:ProductTag},
  onDelete:'CASCADE'
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
