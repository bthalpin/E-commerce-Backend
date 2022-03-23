const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
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
  // be sure to include its associated Category and Tag data
  try{
    const selectedProduct = await Product.findOne({where:{id:req.params.id},include:[Category,Tag]})
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
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
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
      console.log(err);
      res.status(500).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  console.log('put',req.body)
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { productId: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      console.log(productTags)
      const productTagIds = productTags.map(({ tagId }) => tagId);
      // create filtered list of new tag_ids
      console.log(productTagIds,req.body.tagId)
      const newProductTags = req.body.tagId
        .filter((tagId) => !productTagIds.includes(tagId))
        .map((tagId) => {
          console.log(tagId,'INSIDE MAP')
          return {
            productId: req.params.id,
            tagId,
          };
        });
        console.log(newProductTags,'NEW TAGS    AS SDDASADSD A')
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tagId }) => !req.body.tagId.includes(tagId))
        .map(({ id }) => id);
        console.log(productTagsToRemove,'test')
      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
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
