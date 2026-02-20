require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const inventoryRoutes = require('./routes/inventory.routes')
const itemsRoutes = require('./routes/item.routes')
const searchRoutes = require('./routes/search.routes')

app.use(cors({
  origin: ["https://frontend.com", "http://localhost:4200"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/items', itemsRoutes)
app.use('/api/search', searchRoutes)

module.exports = app;