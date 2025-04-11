const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/db2');

const app = express();
const port = 3000;  
mongoose.set('strictQuery', false);
app.use(cors());
app.use(express.json());

mongoose.connect(config.db, {})
.then(() => console.log("Kosildy"))
.catch(()=> console.error("KAte"))

const taskSchema = new mongoose.Schema({
  title: String
});

const Task = mongoose.model('Task', taskSchema);


app.get('/tasks', async(req, res) => {
  try{
    const tasks = await  Task.find();
     res.json(tasks);
  }catch(err){
    res.status(500).json({message: "Kate"})
  }
})

app.post('/tasks', async(req, res) => {
  try{
    const newTask = new Task({title: req.body.title})
    await newTask.save();
  }catch(err){
    res.status(500).json({message: "Kate"})
  }
})
app.put('/tasks/:id', async(req, res)=> {
 try{
  const updateTask = await Task.findByIdAndUpdate(req.params.id, {
    title: req.body.title
  }, {
    new: true
  })
  res.json(updateTask);
 }catch(err){
  res.status(500).json({message: "Kate"})
 }
})

app.delete('/tasks/:id', async(req, res) => {
  try{
    await Task.findByIdAndDelete(req.params.id);
    res.json({message: "KOsildy"})
  }catch(err){
    res.status(500).json({message: "Kate"})
  }
})


app.listen(port, () => console.log(`Server: http://localhost:${port}`))