const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'talalSecretKey'

app.use(express.json());

const users = [];

// endpoint for user registration:

app.post('/register', (req,res) => {
    const {username, password} = req.body;

    // Check if data is already present;
    const existingUser = users.find((u)=>u.username === username);
    if (existingUser){
        return res.status(400).json({message: 'Username already exist'})
    }

    // Add new user;
    const newUser = {
        id : users.length+1,
        username,
        password,
    }
    users.push(newUser);

    res.status(201).json({message: "User registered successfully"})
})

// Endpoints for Login

app.post('/login', (req,res) => {
    const {username, password} = req.body;

    // Find username and password
    const user = users.find((u)=> u.username ===username && u.password===password)

    if(user){
        //User authenticated so generate the token
        const token = jwt.sign({id:user.id, username:user.username}, secretKey);
        res.json({ token });
    }
    else{
        res.status(401).json({message: "invalid Credentials"})
    }
});

// Protect the route for rg: Dashboard\
app.get('/dashboard', verifyToken, (req,res) => {
    res.json({message: "Welcome to dashboard"})
})

// MiddleWare to verify Token:

function verifyToken(req, res, next){
    const token = req.headers['authorization']

    if(typeof token!==undefined){
        jwt.verify(token, secretKey, (err, authData) => {
            if (err){
                res.sendStatus(403);
            }
            else{
                req.authData = authData;
                next()
            }
        })
    }
    else{
        res.sendStatus(401);
    }
}

// Start Server

const port = 3000;
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`)
});