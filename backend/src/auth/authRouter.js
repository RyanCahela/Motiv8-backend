const express = require('express');
const AuthServices = require('./AuthServices');


const AuthRouter = express.Router();
const jsonParser = express.json();

AuthRouter.route('/')
  .post(jsonParser, (req, res, next) => {
    const { username, password } = req.body;
    const userCredentials = { username, password };
    

    for (const [key, value] of Object.entries(userCredentials)) {
      if(!value) {
        return res.status(400).json({
          error: `missing ${key} in request body`
        });
      }
    }
    //grab user obj from db
    AuthServices.getUserByUsername(req.app.get('db'), username)
      .then(dbUser => {
        if(!dbUser) return res.status(400).json({error: 'Incorrect username'});
        
        //verify req password matches password stored in db.
        return AuthServices.comparePasswords(userCredentials.password, dbUser.password)
                .then(isMatch => {
                  if(!isMatch) return res.status(400).json({error: 'Incorrect password'});
                  //create jwt
                  const subject = dbUser.username;
                  const payload = { user_id: dbUser.id };
                  res.send({
                    authToken: AuthServices.createJwt(subject, payload)
                  })
                })
      })
    //send jwt back to client
  });








module.exports = AuthRouter;