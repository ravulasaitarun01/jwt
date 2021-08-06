const express = require('express');
const users = require('./users');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const app = express();

app.use(verifyToken);
app.use(express.json());
app.listen(1111, () => console.log("Server listening"));

app.get('/api/users',(req, res) => {
    res.send(users);
})

app.get('/api/users/:id', (req, res) => {
    const user = users.find((user) => user.userId === parseInt(req.params.id));
    if (!user)
        res.status(404).send(`No user exists with the given user id : ${req.params.id}`);
    else
        res.send(user);
})

app.post('/api/users', (req, res) => {
    console.log(req.body);
    users.push(req.body);
    res.send(`User with name ${req.body.name} added succesfully`);
    fun(users);
})

app.put('/api/users/:id', (req, res) => {
    let user = users.find((user) => user.userId === parseInt(req.params.id));
    if (!user)
        res.status(404).send(`No user exists with the given user id : ${req.params.id}`)
    else {
        const index = users.indexOf(user);
        user = req.body;
        users.splice(index, 1, user);
        res.send(`User with name ${req.body.name} updated successfully`);
        fun(users);
    }
})

app.delete('/api/users/:id', (req, res) => {
    const user = users.find((user) => user.userId === parseInt(req.params.id));
    if (!user)
        res.status(404).send(`No user exists with the given user id : ${req.params.id}`);
    else {
        const index = users.indexOf(user);
        users.splice(index, 1);
        fun(users);
        res.send(user);
    }
})

const fun = (users) => {
    var s = JSON.stringify(users, null, 2);
    s = "const users = " + s + '\nmodule.exports = users;';
    fs.writeFile('users.js', s, () => {
        console.log('Written successfully');
    });
}

function verifyToken(req, res, next) {
    if(req.url == '/api/login')
    {
        next();
        return;
    }
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get("/api/login", (req, res) => {
    const user = {
        id: 1,
        username: "pranay",
        email: "pranay@gmail.com"
    };
    jwt.sign({ user}, "secretkey", (err, token) => {
        res.json({token});
    });
});