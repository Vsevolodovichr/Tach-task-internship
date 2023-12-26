// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/bicycle_booking', { useNewUrlParser: true, useUnifiedTopology: true });

const bicycleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, minlength: 5 },
  type: { type: String, required: true, minlength: 5 },
  color: { type: String, required: true, minlength: 5 },
  wheelSize: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true, minlength: 5 },
  status: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
});

const Bicycle = mongoose.model('Bicycle', bicycleSchema);

// API routes
app.get('/bicycles', async (req, res) => {
  try {
    const bicycles = await Bicycle.find();
    res.json(bicycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/bicycles', async (req, res) => {
  const bicycleData = req.body;
  try {
    const newBicycle = new Bicycle(bicycleData);
    await newBicycle.save();
    res.status(201).json(newBicycle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/bicycles/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const bicycle = await Bicycle.findById(id);
    if (!bicycle) {
      return res.status(404).json({ message: 'Bicycle not found' });
    }

    bicycle.status = status;
    await bicycle.save();

    res.json(bicycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Додайте решту маршрутів для видалення і підрахунку статистики

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
