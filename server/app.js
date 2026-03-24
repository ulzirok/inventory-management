require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const categoryRoutes = require("./routes/category.routes");
const itemsRoutes = require("./routes/item.routes");
const searchRoutes = require("./routes/search.routes");
const searchByTagRoutes = require("./routes/search-by-tag.routes");
const tagsRoutes = require("./routes/tags.routes");
const commentRoutes = require("./routes/comment.routes");
const likesRoutes = require("./routes/likes.routes");
const salesforceRoutes = require("./routes/salesforce.routes");
const odooRoutes = require("./routes/odoo.routes");
const powerAutomateRoutes = require("./routes/power-automate.routes");
const expressWs = require('express-ws')(app);
const aWss = expressWs.getWss();
const socketHandler = require('./webSocket/socketHandler');
const { handleClose } = require('./webSocket/socketController');
const jwt = require('jsonwebtoken'); 

app.use(
  cors({
    origin: ["https://spiffy-biscochitos-96b7d0.netlify.app", "http://localhost:4200"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(express.json());

require("./middleware/passport-jwt")(passport);
require("./middleware/passport-google")(passport);
require("./middleware/passport-facebook")(passport);
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/search-by-tag", searchByTagRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/salesforce", salesforceRoutes);
app.use("/api/odoo", odooRoutes);
app.use("/api/power-automate", powerAutomateRoutes);

app.ws('/api/chat', (ws, req) => {
  const token = req.query.token;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    ws.userId = payload.userId
    if (!ws.userId) return ws.close();
    
  } catch (error) {
    ws.close();
    return;
  }
  
  ws.on('message', (msg) => {
    try {
      socketHandler(ws, msg, aWss)
    } catch (error) {
      console.log(error);
      
      ws.send(JSON.stringify({
        method: "ERROR",
        message: "Server error"
      }));
    }
  });
  
  ws.on('close', () => {
    try {
      handleClose(ws, aWss)
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = app;
