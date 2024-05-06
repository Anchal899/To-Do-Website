const{comparePass} =require('./bcryptService')
const db = require("../models");
const op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const key = 'mysecretkey';
async function createUser(user) {
  let usersaved = await db.users.create(user);
  return usersaved;
}


async function checkLogin(username,password) {
  let userDb = await db.users.findOne({ where: { username:username } })
  console.log('userDb :>> ', userDb);
  if (!! userDb) {
    if (comparePass(userDb.password,password) ){
      return userDb;
    }
  }
  return null;

}

async function createToken(username) {
  let token =await jwt.sign(username, key);
  console.log('token :>> ', token);
  return token;

}

module.exports = { checkLogin, createUser, createToken };