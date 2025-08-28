import jwt from "jsonwebtoken";

const JWT_SECRET = "WebTokenStringSecure";

const fetchUser = (req,res,next) => {

    const token = req.header('auth-token');
    if(!token) return res.status(401).send({error: "Please authenticate using a Valid Token !"});

    try{

        const verifiedString = jwt.verify(token,JWT_SECRET);
        req.user = verifiedString.user;

        next();

    } catch(error){
        res.status(401).send({error: "Please authenticate using a valid token !"});
    }

}

export default fetchUser