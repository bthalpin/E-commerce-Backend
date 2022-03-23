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

    // Foreign key for product
    productId:{
      type:DataTypes.INTEGER,
      references:{
        model:'product',
        key:'id',
        onDelete:'CASCADE'
      }
    },

    // Foreign key for tag
    tagId:{
      type:DataTypes.INTEGER,
      references:{
        model:'tag',
        key:'id',
        onDelete:'CASCADE'
      }
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
