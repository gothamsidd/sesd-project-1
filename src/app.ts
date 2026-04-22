import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import subjectRoutes from "./routes/subject.routes";
import taskRoutes from "./routes/task.routes";
import sessionRoutes from "./routes/session.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files — works from both src/ and dist/
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);

app.use(errorHandler);

export default app;
