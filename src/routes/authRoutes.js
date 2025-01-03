console.log("authRoutes.js loaded successfully");

import { Router} from "express";
import passport from "passport";
import { 
    register,
    login,
    logout,
    authStatus,
    setup2FA,
    verify2FA,
    reset2FA,
 } from "../controllers/authController.js"; 

 

const router = Router();

//Registration Route
router.post("/register", register);

//Login Route
router.post(
    "/login",
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error("Error during authentication:", err);
                return res.status(500).json({ message: "Authentication error" });
            }
            if (!user) {
                return res.status(401).json({ message: info.message || "Authentication failed" });
            }
            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    console.error("Error during login:", loginErr);
                    return res.status(500).json({ message: "Login error" });
                }
                console.log("Login successful:", user);
                next();
            });
        })(req, res, next);
    },
    login
);


//Auth Status Route
router.get("/status", authStatus);

//Logout Route
router.post("/logout", logout);


console.log(" 2fa encountered");
//2FA setup
router.post("/2fa/setup", (req, res, next) => {
    console.log("Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
        if(req.isAuthenticated()) return next();
        res.status(401).json({ message: "Unauthorized" });
}, 

setup2FA

);

//verify Route
router.post("/2fa/verify",
     (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
}, 
verify2FA
);

//Reset Route
router.post("/2fa/reset", 
    (req, res, next) => {
        console.log("in reset thing");
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
}, 
reset2FA
);
 
export default router;
