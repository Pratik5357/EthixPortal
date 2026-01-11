import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import reviewerRoutes from "./routes/reviewerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();

dotenv.config();

const allowedOrigins = [
  "https://ethixportal.netlify.app",
  "http://localhost:5173"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Field-Path, X-File-Name"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());


app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/reviewer", reviewerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/documents", documentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(3000, () => console.log("Server running on port 3000"));
})
.catch(err => console.log(err));




