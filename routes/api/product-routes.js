const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try{
    const products = await Product.findAll({include:[Category,Tag]})
    res.status(200).json(products)
    
  } catch(err){
    res.status(500).json(err)

  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try{
    const selectedProduct = await Product.findByPk(req.params.id,{include:[Category,Tag]})
    if(!selectedProduct){
      res.status(400).json('No product in database matching that id')
      return
    }
    res.status(200).json(selectedProduct)

  } catch(err){
    res.status(500).json(err)
  }
});

// create new product
router.post('/', (req, res) => {
  
  // If not all information is passed in
  if (!req.body.productName || !req.body.price || !req.body.stock || !req.body.tagIds || !req.body.categoryId){
    res.status(400).json('Not enough information to create a new product. ');
    return
  }
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tagId) => {
          return {
            productId: product.id,
            tagId,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {

  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      
      // If no new information is entered
      if(product[0]===0&&!req.body.tagId){
        return 'No product was updated, please check information provided'
      }
      
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { productId: req.params.id } });
    })
    .then((productTags) => {

      // If no new information was entered and no tagIds provided
      if (productTags === 'No product was updated, please check information provided'){

        return {status:400,msg:'No product was updated, please check information provided'}
      }

      // If no tagId array is present, then the information is updated already
      if (!req.body.tagId){
        return {status:200,msg:'Product updated'}
      }

      // get list of current tagIds
      const productTagIds = productTags.map(({ tagId }) => tagId);
      
      // If no new information entered and tagId array is the same as current tagId array
      if (JSON.stringify(req.body.tagId.sort())==JSON.stringify(productTagIds)){
        return {status:400,msg:'Product not updated, no new information added'}
      }

      // create filtered list of new tag_ids
      const newProductTags = req.body.tagId
        .filter((tagId) => !productTagIds.includes(tagId))
        .map((tagId) => {
          return {
            productId: req.params.id,
            tagId,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tagId }) => !req.body.tagId.includes(tagId))
        .map(({ id }) => id);

      // run both actions
      Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);

      // Once product tags are updated
      return {status:200,msg:'Product updated with appropriate tag changes'}
    })
    .then((response) => res.status(response.status).json(response.msg)) //response object used to prevent multiple res.json calls
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    const deletedProduct = await Product.destroy({
      where:{
        id:req.params.id
      }
    })

    // If no rows deleted
    if (!deletedProduct){
      res.status(400).json('No matching product in the database')
      return
    }
    res.status(200).json(`Product deleted`)

  }catch(err){
    res.status(500).json(err)
  }
});

module.exports = router;
