// required package for authorization
import express from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

// already defined models here
import User from '../models/User.js';
import fetchUser from '../middleware/fetchUser.js'

// router here
const router = express.Router();
const JWT_SECRET = "WebTokenStringSecure";

// Route 1 : For creating the user
router.post('/createuser',[

    // validation checks
    body('fullName','User must provide his/her name for Further Validation !').notEmpty(),
    body('phonenumber','Phone Number or Contact must be within 10 letters !').isLength({min:10}),
    body('email','Email must be valid containing its proper format !').isEmail(),
    body('password','You must enter a strong password regarding security purposes !').isStrongPassword().isLength({min:8}),

],  async (req,res) => {
    
        let success = false;
        const result = validationResult(req);

        if(!result.isEmpty()) return res.status(400).json({result: result.array()});

        try{

            let user = await User.findOne({email: req.body.email});
            if(user) return res.status(400).json({success,message: "Warning : A user with this email already exits !"});

            const salt = bcrypt.genSaltSync(10);
            let securePass = await bcrypt.hash(req.body.password,salt);

            user = await User.create({
                fullName : req.body.fullName,
                phonenumber: req.body.phonenumber,
                email: req.body.email,
                password: securePass,
                company: req.body.company
            })

            const data = {
                user: {id: user.id},
            }

            const jwtToken = jwt.sign(data,JWT_SECRET);
            success = true;
            return res.json({success,jwtToken});

        } catch(error){
            console.error(error.message);
            return res.status(500).send("Some Error occured from Server Side !");
        }

    }
)

// Route 2 : For User's Login Request
router.post('/login',[

    body('email','Please enter a valid Email !').isEmail(),
    body('password','Password can not be blank !').exists()

],  async (req,res) => {
    
    let success = false;
    const result = validationResult(req);

    if(!result.isEmpty()) return res.status(400).json({result: result.array()});

    const {email,password} = req.body;
    try{

        let user = await User.findOne({email});
        if(!user) return res.status(400).json({success,message: "Email doesn't exists !"})

        const userPasswordComparison = await bcrypt.compare(password,user.password);
        if(!userPasswordComparison) return res.status(400).json({success,message: "Password you entered is Wrong !"});

        const data = {
            user: {id: user.id}
        }

        const jwtToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,jwtToken});

    } catch(error){
        console.error(error.message);
        return res.status(500).send("Some Error occured from server side !");
    }

})

// Route 3 : Keeping the user logged in here once it has login in to the site : Login is required here once !
router.post('/getuser',fetchUser,
    async (req,res) => {

        let success = false;

        try{
            
            const userID = req.user.id;
            const user = await User.findById(userID).select("-password");
            if(!user) return res.status(400).json({success,message: "User don't exits please create an Account First !"});

            success = true;
            res.json({success,user});
            
        } catch(error){
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }
)

export default router;