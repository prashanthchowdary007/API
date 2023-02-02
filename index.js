const express = require ('express');
const user = require('./userlist')
const mongoos = require('mongoose');
const post = require('./post');
const jwt = require('jsonwebtoken')
const middleware = require('./middleware');
const app = express();

app.use(express.json());
mongoos.connect("mongodb+srv://prashanth9001:Y5CVlxLl4JqBSxxJ@cluster0.g8msx0x.mongodb.net/?retryWrites=true&w=majority").then(()=> console.log("DB connected...!"))
app.get('/',async(req,res)=>{
    res.send("hello world");
})


app.post('/newuser',async(req,res)=>{
    try{
        const {name,email,phoneno,password,confirmpassword}=req.body
        let exist = await user.findOne({email});
        if(exist)
        {
        return res.send("user already exist");
        }
        if(password!=confirmpassword)
        {
        return res.send("Password Not Match");
        }

        let newuser = new user({
        name,email,phoneno,password,confirmpassword
        }) 
        await newuser.save();
        res.send("data copide..!");
        }
    catch(err)
    {
      console.log(err);
    }
})

app.post('/login',async(req,res)=>{
    try{
      const {email,password}=req.body
      let exist = await user.findOne({email});
      if(!exist){
        return res.send("user not fund");
      }
      if(exist.password != password){
        return res.send("username or password incorrect");
      }
      let payload = {
          user:{
            id : exist.id
          }
      }
      jwt.sign(payload,'jwt',{expiresIn:60000},
        (err,token)=>{
            if(err) throw err;
            return res.json({token})

      })
    }
    catch(err){
    console.log(err);
    }
})


app.get('/profile',middleware,async(req,res)=>{
  try{
    let exist = await user.findById(req.user.id);
    if(!exist){
      return res.send("user not found");
    }
    res.json(exist);

  }
  catch(err){
    console.log(err);
  }
    
})
app.post('/adpost',middleware,async(req,res)=>{
try{
   let exist = await user.findById(req.user.id);
    if(!exist){
      return res.send("user not found");
     }
     res.json(exist);
     const{name,title,postcon}=req.body;
     let newpost = new post({
      name,title,postcon
     })
     await newpost.save();
     res.send('post copied...!')
} 
catch(err){
  console.log(err);
}
})
app.get('/posts',async(req,res)=>{
  const data = await post.find();
  res.json(data);
})
app.listen(9001,()=>console.log("server is running on port 9001"))