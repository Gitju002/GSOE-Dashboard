import express from "express";
import {
  deleteAgent,
  getAgentsById,
  getAgentsWithFilter,
  registerAgent,
  updateAgent,
} from "../controller/agent.js";
import {
  agentValidation,
  agentValidationUpdate,
} from "../middleware/validation/agent-validation.js";
import auth from "../auth/auth.js";

const app = express.Router();

app.use(auth.isAuthenticated, auth.isOperator);

app.post("/register", agentValidation, registerAgent);
app.get("/get", getAgentsWithFilter);
app.get("/get/:agentId", getAgentsById);
app.put("/update/:id", agentValidationUpdate, updateAgent);
app.delete("/delete/:agentId", deleteAgent);

export default app;
