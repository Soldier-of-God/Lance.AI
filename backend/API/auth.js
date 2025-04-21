const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


const GOOGLE_CLIENT_ID = "283954721652-5kek0su91htpbpap10114qdtc0evr6i1.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
let userName="";


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback" // when we enter google/auth redirect them using this url
  },
  // someone succesfully logs in
  async function(accessToken, refreshToken, profile/* this profile is the one you tap when you sign in, has all profile info */, cb) {
    try {
        const { addUser, findUserByGoogleId } = require('./index.js'); // Import here to break circular dependency

        let user = findUserByGoogleId.get(profile.id);

        if (!user) {
            const newUser = {
                googleId: profile.id,
                email: profile.emails[0].value,
                displayName: profile.displayName
            };
            addUser.run(newUser);
            user = findUserByGoogleId.get(profile.id);
            userName= profile.displayName
        }

        cb(null, user);
    } catch (error) {
        cb(error);
    }
}

));
function username(){
    return userName;
}

passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  
  passport.deserializeUser(async (id, cb) => {
    try {
        const {findUserById} = require("./index.js")
      const user = findUserById.get(id);
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  });

  module.exports={
    username
  }