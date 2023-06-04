const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());

// Database

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/loginMern",{
    useNewUrlParsers: true,
    useUnifiedTopology: true,
}) .then(() => {
    console.log("Connection Succesful")
}).catch((err) => {
    console.log(err);
})

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    Email : {
        type : String,
        required : true,
        unique : true
    },
    Password : String,
    repassword : String

})
const userModel = new mongoose.Model("UserModel", userSchema)
// get & post request

// app.get('/', (req, res) => {
//     res.send("App is Running");
// })
app.post('/register', (req, res) => {
    console.log(req.body);
    const{firstName, lastName,Email,Password,repassword} = req.body;
    userModel.findOne({Email : email},(err, user) => {
        if(user){
            res.send({Message: "This Email is already registered"})
        }
        else {
            const user = new userModel({
                firstName,
                lastName,
                Email,
                Password,
                repassword
            })
            user.save();
            res.send({Message : "Successfully registered"})
        }
    })
})

app.post('/login',(req, res) => {
    console.log(req.body)
    const {Email, Password} = req.body
    userModel.findOne({Email : Email}, (err,user) => {
        if(user) {
            if(Password == user.password) {
                res.send({Message : "Login Successful", user})
            }
            else {
                res.send({Message : "Password didn't match"})
            }
        }
        else {
            res.send({Message : "This Email is not registered"})
        }
    })   
})

// listen port 8080
app.listen(8080,() => {
    console.log("Server listening on port 8080")
})