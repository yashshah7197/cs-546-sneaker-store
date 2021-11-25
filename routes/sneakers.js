const express = require('express');
const router = express.Router();
const data = require('../data');
const sneakersData = data.sneakers;

const {ObjectId} = require('mongodb');

router.get('/', async(req, res) => 
{
    try {
        const sneakers = await sneakersData.getAll();
        res.render('store/sneakersList',{sneakers:sneakers});
      } catch (e) {
        res.sendStatus(500);
      }
});

router.get('/:id', async(req, res) => 
{
    try {
        const sneaker = await sneakersData.get(req.params.id);
        res.render('store/sneakerUpdate',{sneaker:sneaker});
      } catch (e) {
        res.status(404).json({ message: ' There is no Sneaker with that ID' });
      }
});

module.exports = router;
