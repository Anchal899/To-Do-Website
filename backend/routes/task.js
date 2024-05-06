var express = require('express');
var router = express.Router();
const db = require("../models");
const op = db.Sequelize.Op;
/* GET tweets listing. */

router.get('/:id', async function(req, res, next) {
  let userid1=req.params.id;
  let alltasks=await db.task.findAll({
    where:{userid:userid1},
    // include:'task'
  });
  res.json(alltasks);
  // res.send('All tweets');
});





module.exports = router;