const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    const catergories = await Category.findAll({include:Product})
    res.json(catergories)
    
  } catch(err){
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const selectedCategory = await Category.findOne({where:{id:req.params.id},include:Product})
    res.json(selectedCategory)
   
    
  } catch(err){
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  // create a new category
  console.log(req.body)
  try{
    if (!req.body.categoryName){
      res.status(400).json('Must enter category name');
      return
    }
    const newCategory = await Category.create(req.body)
    // newCategory.dataValues.message = "Successfully added"
    // console.log(newCategory)
    res.status(200).json(newCategory)

  }catch(err){
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    if (!req.body.categoryName){
      res.status(400).json('Must enter category name');
      return
    }
    const updatedCategory = await Category.update(req.body,{
      where:{
        id:req.params.id
      },
    })
    if(!updatedCategory[0]){
      res.status(400).json('No updates were made')
      return
    }
    res.status(200).json(`Category name changed to ${req.body.categoryName}`)

  }catch(err){
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    
    const deletedCategory = await Category.destroy({
      where:{
        id:req.params.id
      }
    })
    if (!deletedCategory){
      res.status(400).json('No matching category in the database')
      return
    }
    res.status(200).json(`Category deleted`)

  }catch(err){
    res.status(500).json(err)
  }
});

module.exports = router;
