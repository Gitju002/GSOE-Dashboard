import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import { Agent } from "../model/agent.js";
import { genrateCustomizedAgentId } from "../utils/customized-id.js";
import { sendMail } from "../utils/services/mail-service.js";
import fs from "fs";

export const registerAgent = asyncErrorHandler(async (req, res, next) => {
  const { avatarUrl, fullName, email, phone, address } = req.body;

  const existingAgent = await Agent.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingAgent?.email === email) {
    return next(new ErrorResponse("Email address already exists", 400));
  }
  if (existingAgent?.phone === phone) {
    return next(new ErrorResponse("Phone number already exists", 400));
  }

  const _id = await genrateCustomizedAgentId();

  const agent = await Agent.create({
    _id,
    avatarUrl,
    fullName,
    email,
    phone,
    address,
  });

  let htmlContent = fs.readFileSync(
    "./utils/mail-body/register-agent-mail.html",
    "utf8"
  );
  htmlContent = htmlContent.replace(/\$\{fullName\}/g, agent.fullName);
  await sendMail({
    from: process.env.MAIL_ID,
    to: agent.email,
    subject: "Agent Registration",
    html: htmlContent,
  });

  return res.status(201).json({
    success: true,
    message: "Agent created successfully",
    data: agent,
  });
});

export const getAgentsWithFilter = asyncErrorHandler(async (req, res, next) => {
  const {
    page = 1,
    limit,
    search = "",
    startTimeStamp,
    endTimeStamp,
    sortBy = "dsc",
  } = req.query;

  const start = startTimeStamp ? new Date(startTimeStamp) : null;
  const end = endTimeStamp ? new Date(endTimeStamp) : null;

  const filterConditions = [];

  if (start && end) {
    filterConditions.push({ createdAt: { $gte: start, $lte: end } });
  }

  if (search) {
    filterConditions.push({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { _id: { $regex: search, $options: "i" } },
      ],
    });
  }

  const finalFilter =
    filterConditions.length > 0 ? { $and: filterConditions } : {};

  const totalAgents = await Agent.countDocuments(finalFilter);
  const agents = await Agent.find(finalFilter)
    .sort({ createdAt: sortBy === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .exec();

  if (!agents.length) {
    return next(new ErrorResponse("No agents found", 404));
  }

  return res.status(200).json({
    success: true,
    data: {
      agents,
      totalAgents,
    },
  });
});

export const updateAgent = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { avatarUrl, fullName, email, phone } = req.body;

  const agent = await Agent.findById(id);
  if (!agent) {
    return next(new ErrorResponse("Agent not found", 404));
  }

  const existingAgent = await Agent.findOne({
    $or: [{ email }, { phone }],
    _id: { $ne: id },
  });
  if (existingAgent && existingAgent?.email === email) {
    return next(new ErrorResponse("Email address already exists", 400));
  }

  if (existingAgent && existingAgent?.phone === phone) {
    return next(new ErrorResponse("Phone number already exists", 400));
  }

  const updatedAgent = await Agent.findByIdAndUpdate(
    id,
    {
      avatarUrl,
      fullName,
      email,
      phone,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Agent updated successfully",
    data: updatedAgent,
  });
});

export const getAgentsById = asyncErrorHandler(async (req, res, next) => {
  if (
    !req.params.agentId ||
    req.params.agentId === "" ||
    req.params.agentId === null ||
    req.params.agentId === undefined
  ) {
    return;
  }

  const { agentId } = req.params;
  const agent = await Agent.findById(agentId);

  if (!agent) {
    return next(new ErrorResponse("Agent not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: agent,
  });
});

//! agent delete korle tar coins gulo ki hobe????????????
export const deleteAgent = asyncErrorHandler(async (req, res, next) => {
  const { agentId } = req.params;

  const agent = await Agent.findByIdAndDelete(agentId);
  if (!agent) {
    return next(new ErrorResponse("Agent not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Agent deleted successfully",
    data: agent,
  });
});
