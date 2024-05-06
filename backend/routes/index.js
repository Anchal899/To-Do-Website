var express = require('express');
var router = express.Router();
const db = require("../models");
const jwt = require('jsonwebtoken');
const key='mysecretkey';
const { createUser, checkLogin, createToken } = require('../service/userService');
const { comparePass , hashPass,test } = require('../service/bcryptService');

const { where } = require('sequelize');
const op = db.Sequelize.Op;
const { Sequelize } = db;
/* GET home page. */
db.sequelize.sync().then(() => {
  console.log("db sync done")
});
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function (req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/users', async function (req, res, next) {
  res.json(await db.users.findAll({}));
});

router.post('/users', async function (req, res, next) {
  let user = { ...req.body };
  if (!user.username || !user.password) {
    res.status(400).json({ message: 'username and password not given' });
    return;
  }
  let usersaved = await createUser(user);
  res.json({ userid: usersaved.userid, username: usersaved.username });
});


router.post('/home', async function (req, res, next) {
  let username = req.body.username;
  let password=req.body.password;
  // if (!username || !password) {
  //   res.status(400).json({ message: 'username and password not given' });
  //   return;
  // }
  let userDb = await checkLogin(username,password);
  if (!!userDb) {
    let token=createToken({username:userDb.username});
  //  console.log('token in route:>> ', token);
    req.session.username=userDb.username;
    req.session.userid=userDb.userid;
    let tasks=await db.task.findAll({where:{username:userDb.username}});
    //console.log(tasks[0].description);
    //console.log(userDb.username);

    // res.json({ status: true, token: token });
    res.render('home',{username:userDb.username,token:token,userid:userDb.userid,prevTasks:tasks});
  }
  else {
    res.json({ status: false });
  }
});
router.post('/register',async function(req,res,next){
  try{
    let username=req.body.username;
    let password=req.body.password;
    let confirmpassword=req.body.confirmpassword;
    console.log(password);
    console.log(confirmpassword);
    console.log(await hashPass(password));
    if(password==confirmpassword){
      let pass=await hashPass(password);
      console.log(req.body.password);
      
      let savedUser=await db.users.create({
        username:username,
        password:pass,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
      });
     
      res.render('index');

    }}
    catch(error){
      console.error('Error creating user:', error);
      res.status(500).send("Internal server error");
    }
  


});
router.post('/task', async function(req, res, next) {
  try {
    const taskDescription = req.body.taskDes;
    if (!taskDescription) {
      return res.status(400).json({ message: 'Task description is required' });
    }
    // Create the task in the database
    const newTask = await db.task.create({
      description: taskDescription,
      userid:req.session.userid,
      username:req.session.username,
      time: Sequelize.literal('CURRENT_TIMESTAMP') // Assuming you want to record the creation timestamp
    });
    const pTasks = await db.task.findAll({
      where: { username: newTask.username }
    });
    res.render('home',{ prevTasks: pTasks ,taskid:pTasks.taskid,username:req.session.username});
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/home',async(req,res,next)=>{
  let taskId=taskid;
  let deleted=await db.task.destroy({where:{
    taskid:taskId
  }})
  res.json({message:"Task deleted"})
})
router.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send('Internal Server Error');
      }
      // Redirect to the login page or any other appropriate page
      res.render('index');
  });
});
router.get('/tasks', async function (req, res, next) {
  //let authHeader=req.header('authorization');
  // Bearer token
  //repace bearer and get token only
  //let token=authHeader.substring(7);
  console.log(token);
  let decodedToken=jwt.verify(token,key);
  const username=decodedToken.username;

  let task=await db.task.findAll({where:{username:username}});  
  console.log(task);
  //verify token that it is not altererd
  //from token get username
  //from db get todos of username and send them
  res.json({authHeader,task});
});

router.get('/:userid', async function(req, res, next) {
  let userid1=req.params.userid;
  let alltasks=await db.task.findAll({
    where:{userid:userid1},
    // include:'task'
  });
  res.json(alltasks);
  // res.send('All tweets');
});
router.delete('/tasks/:taskId', async (req, res) => {
  console.log(45);
  try {
      // Extract taskId from request parameters
      const taskId = req.params.taskId;

      // Find the task in the database by taskId and delete it
      const deletedTask = await db.task.destroy({
          where: { taskid: taskId }
      });

      if (deletedTask === 1) {
          // Task was successfully deleted
          res.status(200).json({ message: 'Task deleted successfully' });
      } else {
          // Task with the given taskId was not found
          res.status(404).json({ error: 'Task not found' });
      }
  } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/tasks/:taskId', async (req, res) => {
  try {
    // Extract taskId from request parameters
    const taskId = req.params.taskId;

    // Extract updated task information from the request body
    const {description} = req.body;
console.log(description);
console.log(taskId);
    // Find the task in the database by taskId and update it
    const updatedTask = await db.task.update(
      { description, time:Sequelize.literal('CURRENT_TIMESTAMP') }, // New task data to update
      { where: { taskid: taskId } } // Condition to find the task
    );
console.log("process");
    if (updatedTask[0] === 1) {
      // Task was successfully updated
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      // Task with the given taskId was not found
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
