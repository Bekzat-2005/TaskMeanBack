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
.then(() => console.log("Baza kosildy"))
.catch(() => console.error("Kate"))

const taskSchema = new mongoose.Schema({
    title: String
});
const Task = mongoose.model('Task', taskSchema);


app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Тапсырмаларды алу мүмкін болмады' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ 
      title: req.body.title
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Тапсырма қосу мүмкін болмады' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, 
      { 
        title: req.body.title
      }, 
      { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Тапсырманы жаңарту мүмкін болмады' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Тапсырма өшірілді' });
  } catch (err) {
    res.status(500).json({ message: 'Тапсырманы өшіру мүмкін болмады' });
  }
});

app.listen(port, () => {
  console.log(`Сервер http://localhost:${port} жұмыс істеп тұр`);
});
