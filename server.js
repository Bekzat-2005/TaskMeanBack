const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
;

// Конфигурациялық файлды импорттау
const config = require('./config/db2');

// Express қосымшасын құру
const app = express();
const port = 3000;  // Сервердің портын орнатамыз

// Mongoose-де strictQuery опциясын орнату
mongoose.set('strictQuery', false);

// CORS (Cross-Origin Resource Sharing) орнату, Angular қосымшасымен жұмыс жасау үшін
app.use(cors());

// JSON форматындағы деректерді алу үшін Express ішіндегі bodyParser қолдану
app.use(express.json());

// MongoDB-ге қосылу
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB қосылды'))
.catch(err => console.error('MongoDB қосылмады:', err));

// Task моделін анықтау (MongoDB)
const taskSchema = new mongoose.Schema({
    title: String,
    description: String
});
const Task = mongoose.model('Task', taskSchema);

// API маршруттары

// Барлық тапсырмаларды алу
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Тапсырмаларды алу мүмкін болмады' });
  }
});

// Жаңа тапсырма қосу
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ 
      title: req.body.title, 
      description: req.body.description 
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Тапсырма қосу мүмкін болмады' });
  }
});

// Тапсырманы жаңарту
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, 
      { 
        title: req.body.title, 
        description: req.body.description, 
        completed: req.body.completed 
      }, 
      { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Тапсырманы жаңарту мүмкін болмады' });
  }
});

// Тапсырманы өшіру
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Тапсырма өшірілді' });
  } catch (err) {
    res.status(500).json({ message: 'Тапсырманы өшіру мүмкін болмады' });
  }
});

// Серверді іске қосу
app.listen(port, () => {
  console.log(`Сервер http://localhost:${port} жұмыс істеп тұр`);
});
