// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    productName:{
      type:DataTypes.STRING,
      allowNull:false
    },
    price:{
      type:DataTypes.DECIMAL,
      allowNull:false,
      validate:{
        isDecimal:{msg:'A number must be entered'}
      }
    },
    stock:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:10,
      validate:{
        isNumeric:{
          msg:'Must enter a number'
        }
      }
    },
    categoryId:{
      type:DataTypes.INTEGER,
      // 
      // ONE to Many
      // FOREIGN KEY
      // 
      // 
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
