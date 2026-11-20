const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

let tasks = [
  { id: 1, title: 'Встановити Node.js та npm', completed: true },
  { id: 2, title: 'Налаштувати Express та Pug', completed: false },
  { id: 3, title: 'Протестувати API у Postman', completed: false }
];
let nextId = 4;

app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Поле "title" є обов\'язковим' });
  }

  const newTask = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Задачу з id=${req.params.id} не знайдено` });
  }

  task.completed = !task.completed;
  res.status(200).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Задачу з id=${req.params.id} не знайдено` });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

app.get('/', (req, res) => res.redirect('/tasks'));

app.get('/tasks', (req, res) => {
  res.render('tasks', { tasks });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}/tasks`);
});
