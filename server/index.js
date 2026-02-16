require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: ["https://frontend.com", "http://localhost:4200"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(express.json())

app.listen(5000, () => {
  console.log(`Server started on ${PORT}`);
})