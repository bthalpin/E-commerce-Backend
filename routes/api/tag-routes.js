const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tags = await Tag.findAll({include:Product})
    res.status(200).json(tags)
    
  } catch(err){
    res.status(500).json(err)

  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const selectedTag = await Tag.findOne({where:{id:req.params.id},include:Product})
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
