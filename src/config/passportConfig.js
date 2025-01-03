import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";


console.log("Passport configuration loaded");
passport.use(
    new LocalStrategy({usernameField: "username", passwordField: "password" },
         async (username, password, done) => {
        try {
            console.log("Searching for user:", username);
            const user = await User.findOne({username});
            if(!user) return done(null, false, {message: "User not found" });


            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                console.log("Password matched");
                return done(null, user);
              } else {
                console.log("Incorrect password");
                return done(null, false, { message: "Incorrect password" });
              }
            } catch (error) {
                return done(error);
        }

    })
);

passport.serializeUser((user, done) =>{
    console.log("We are inside serializeUser");
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) =>{
    try {
        console.log("We are inside deserializeUser");
        const user = await User.findById(_id);
        console.log("Deserialized user:", user);
        done(null, user)
    } catch (error) {
        done(error);
    }
    
});