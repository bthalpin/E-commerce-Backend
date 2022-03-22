const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    productId:{
      type:DataTypes.INTEGER,
      references:{
        model:'product',
        key:'id'
      }
      // 
      // 
      // FOREIGN KEY
      // MANY TO MANY?
      // 
    },
    tagId:{
      type:DataTypes.INTEGER,
      references:{
        model:'tag',
        key:'id'
      }
      // 
      // 
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
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
