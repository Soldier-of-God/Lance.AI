// entry point, its also our api appliication
const express = require('express'); // pull in that express package // requite is node func that pulls in
const app = express(); //  calls an instannce of the express package 
const session = require('express-session');
const passport = require('passport');

const auth = require(("./auth.js")); // can get loaded into index js 


function isLogged(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

const db =  require("better-sqlite3")("LANCE.db");


const bcrypt =  require("bcrypt");


db.pragma("journal_mode=WAL"); // 


app.use(session({
    secret: "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",
    resave: false,
    saveUninitialized: true
  }));


app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false})) // makles so we can use the parametes the user filled in in the form 
app.use(express.static("public"))


app.use((req, res,next)=>{ // middle ware
    res.locals.error = [];
    next(); //next middleware func in the middlewarte stack
})

// google ///


app.get("/auth/google", 
    passport.authenticate('google', {scope: ["email", "profile"]})
);

app.get("/google/callback", 
    //res.send('<p>You have signed in to LANCE</p>')
    passport.authenticate('google',
        {
            failureRedirect:'auth/failure',
            successRedirect: "/signed",
          
        }
    )
)


app.get('/signed',isLogged,(req,res)=>{
    const {userName} = require('./auth')
    res.render("main", {user: req.user});
});


app.get('/auth/failure',(req,res)=>{
    error.push("failed to authenticate email")
    res.render("homepage", {error})
})
app.get('/logout', (req, res,next) => {
    // Destroy the session first
    req.logout((err) => {  // Pass callback to handle async errors
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).send("Logout failed");
        }
        req.session.destroy((err) => { // 2. Destroy session
            if (err) return next(err);
            
            res.clearCookie('connect.sid'); // 3. Clear session cookie
            res.redirect('/'); // 4. Single redirect
          });
      });
});
///

//USER_MODEL
const createTables = 
    db.prepare(
        `  CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            googleId TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            displayName TEXT NOT NULL
        )
        `).run()

//Add user after Google auth // DB STUFF
const addUser =
    db.prepare(`
    INSERT OR IGNORE INTO users (googleId, email, displayName) 
    VALUES (@googleId, @email,@displayName)
`);
 // reurn changes

// Find user by Google ID
const findUserByGoogleId = db.prepare(`
    SELECT * FROM users WHERE googleId = ?
`); // return row or undefiens

// Find user by email
const findUserByEmail = db.prepare(`
    SELECT * FROM users WHERE email = ?
`); // will retunr the row or undefined
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?');



//0auth

app.listen(3000);
app.get("/", (req, res)=>{
    error = []
    res.render("homepage")// this was possible because we set the app use view engines of the ejs type
})
app.get ("/login", (req, res)=>{
    res.render("login")
})
app.get ("/contacts", (req,res)=>{
    res.render("contacts")
})
// app.post("/register",(req,res)=>{
//   //  const username = req.body.username;
//     //validate our paramets for starage
//     const error = []

// //     if (typeof(req.body.username) !== "string") req.body.username ="";
// //     if (typeof(req.body.password) !== "string") req.body.password ="";

// //     req.body.username = req.body.username.trim();
// // //    / error.push("sup nigga");
// //     if (!req.body.username){
// //         error.push({message: "You need to provide a username"})
// //         return res.render("homepage", {error});
// //     }
// //     if (username.length>10 || username.length<3){
// //         error.push({message:"username is either to short or too long min len is 3 max is 10"})
// //     }
// //     if (!req.body.password){
// //         error.push({message: "You need to provide a password"})
// //         return res.render("homepage", {error});
// //     }
// //     if (username.length>10 || username.length<3){
// //         error.push({message:"password is either to short or too long min len is 3 max is 10"})
// //     }
// //     if(username && !req.body.username.match(/^[a-zA-Z0-9]+$/)) error.push({message: "no special characters"});

// //     if (error.length>0){
// //         return res.render("homepage", {error});
// //     }
// // ERROR FREE
// // //SAVE NEW USER TO DB 
// //         const statement = db.prepare("INSERT INTO users (username, password) VALUES (?,?)");
// //             const salt = bcrypt.genSaltSync(10);
// //             req.body.password = bcrypt.hashSync(req.body.password, salt);
// //             try {
// //              statement.run(req.body.username, req.body.password);
// //             } catch (err) {
// //                 error.push({message: "User already exists"})
                
// //                 return res.render("homepage", {error});
// //             }
           

            
        
//     // has to be sent async to db for confirmaationn and verification 
//                         // LOGGED IN RETURN A COOKIE   
//     // when received return response from db
//         res.render("login")
    



   
// })
module.exports = {
    db, addUser, createTables, findUserByEmail, findUserByGoogleId, findUserById
};

// Require auth.js after exports are fully defined
require('./auth');
