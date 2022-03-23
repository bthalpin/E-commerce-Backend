const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try{
    const tags = await Tag.findAll({include:Product})
    res.status(200).json(tags)
    
  } catch(err){
    res.status(500).json(err)

  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try{
    const selectedTag = await Tag.findByPk(req.params.id,{include:Product})
    res.status(200).json(selectedTag)

  } catch(err){
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    if (!req.body.tagName){
      res.status(400).json('Must enter a Tag name');
      return
    }
    const newTag = await Tag.create(req.body)
    res.status(200).json(newTag)

  }catch(err){
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    if (!req.body.tagName){
      res.status(400).json('Must enter tag name');
      return
    }
    const updatedTag = await Tag.update(req.body,{
      where:{
        id:req.params.id
      },
    })

    // If no rows were changed
    if(!updatedTag[0]){
      res.status(400).json('No updates were made')
      return
    }
    res.status(200).json(`Tag name changed to ${req.body.tagName}`)

  }catch(err){
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{
    
    const deletedTag = await Tag.destroy({
      where:{
        id:req.params.id
      }
    })

    // If no row was deleted
    if (!deletedTag){
      res.status(400).json('No matching tag in the database')
      return
    }
    res.status(200).json(`Tag deleted`)

  }catch(err){
    res.status(500).json(err)
  }
});

module.exports = router;
