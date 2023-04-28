//StAuth10244: I Nicholas Milanovic, 000292701 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

// PLEASE USE THE FOLLOWING COMMANDS TO RUN:
// 1. cd backend
// 2. node index.js
const express = require('express');     // express init for routing
const sqlite3 = require('sqlite3').verbose();   // sqlite3 init for db
const bodyParser = require('body-parser');      // bodyParser init for middleware

const db = new sqlite3.Database("users.db");    // create db

async function createTable(){
    await db.exec("DROP TABLE IF EXISTS users");
    await db.exec("DROP TABLE IF EXISTS leaderboard");
    await db.exec("CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)");
    await db.exec("CREATE TABLE IF NOT EXISTS leaderboard (username TEXT, result TEXT)");
}

createTable().then(() => {
    mathApp.listen(3001, function() {
        console.log("Listening on port 3001");
        db.close();
    });
}).catch((err) => {
    console.log(err);
    db.close();
});

// close db
const mathApp = express();

// body-parser middleware configuration which will parse our requests
// to the json files that are required
mathApp.use(bodyParser.urlencoded({extended: true}));
mathApp.use(bodyParser.json());

// include cors to allow for requests from our ReactJS app running on a different port
const cors = require('cors');

// accept requests from any origin
mathApp.use(cors());

// post method request for the login route
mathApp.post('/login', function(req,res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    let usersDB = new sqlite3.Database('./users.db');
  
    usersDB.all('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, rows) {
      if(err){
        res.status(500).send({error: 'Internal Server Error'});
      } 
      else if(rows.length > 0){
        res.status(200).send({status: 'Success'});
      }
      else{
        res.status(401).send({error : 'Invalid Username/Password'})
        console.log(rows)
      }
    });
  
    usersDB.close();

  });

// post method request for the sign-up route
mathApp.post('/signup', function(req, res) {
    try{
        const username = req.body.username;
        const password = req.body.password;

        let usersDB = new sqlite3.Database('./users.db')

        usersDB.run("INSERT INTO users (username, password) VALUES (?,?)", [username, password], function(err) {
            if (err){
                res.status(500).send({error: 'Internal Server Error'});
            }
            else{
                res.status(200).send({status: 'Success'});
            }
        });
        usersDB.close();
        }
        catch(err){
            console.log(err);
            res.status(500).send({error: 'Internal Server Error'});
        }
    
});

// post method that will update the leaderboard table with the user who got a correct answer
mathApp.post('/update', function(req, res) {
    try{
        const username = req.body.username;
        const result = req.body.result;
        console.log(username);
        console.log(result);
        let leaderboardDB = new sqlite3.Database('./users.db')
        leaderboardDB.run("INSERT INTO leaderboard (username, result) VALUES (?,?)", [username, result], function(err){
            if(err){
                res.status(500).send({error: 'Internal Server Error'});
            }
            else{
                res.status(200).send({status: 'Success'});
            }
        });
        leaderboardDB.close();
    }
    catch(err){
        console.log(err);
        res.status(500).send({error: 'Internal Server Error'});
    }
});
