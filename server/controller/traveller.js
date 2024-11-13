import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import { Traveller } from "../model/traveller.js";
import { genrateCustomizedTravellerId } from "../utils/customized-id.js";
import { sendMail } from "../utils/services/mail-service.js";
import fs from "fs";

export const registerTraveller = asyncErrorHandler(async (req, res, next) => {
  const { avatarUrl, fullName, email, phone, address } = req.body;
  const existingTraveller = await Traveller.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingTraveller && existingTraveller?.email === email) {
    return next(new ErrorResponse("Email already exists", 400));
  }
  if (existingTraveller && existingTraveller?.phone === phone) {
    return next(new ErrorResponse("Phone number already exists", 400));
  }

  const _id = await genrateCustomizedTravellerId();

  const traveller = await Traveller.create({
    _id,
    avatarUrl,
    fullName,
    email,
    phone,
    address,
  });
  let htmlContent = fs.readFileSync(
    "./utils/mail-body/register-traveller-mail.html",
    "utf8"
  );
  htmlContent = htmlContent.replace(/\$\{travellerName\}/g, traveller.fullName);
  await sendMail({
    from: process.env.MAIL_ID,
    to: traveller.email,
    subject: "Traveller Registration",
    html: htmlContent,
  });

  return res.status(201).json({
    success: true,
    message: "Traveller created successfully",
    data: traveller,
  });
});

export const updateTraveller = asyncErrorHandler(async (req, res, next) => {
  const { travellerId } = req.params;
  const { avatarUrl, fullName, email, phone } = req.body;
  const existingTraveller = await Traveller.findOne({
    $or: [{ email }, { phone }],
    _id: { $ne: travellerId },
  });

  if (existingTraveller && existingTraveller?.email === email) {
    return next(new ErrorResponse("Email already exists", 400));
  }
  if (existingTraveller && existingTraveller?.phone === phone) {
    return next(new ErrorResponse("Phone number already exists", 400));
  }
  const updatedTraveller = await Traveller.findByIdAndUpdate(
    travellerId,
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
    message: "Traveller updated",
    data: updatedTraveller,
  });
});

export const getAllTravellerWithFilter = asyncErrorHandler(
  async (req, res, next) => {
    const {
      page = 1,
      limit,
      search = "",
      startTimeStamp,
      endTimeStamp,
      sortBy = "desc",
    } = req.query;

    const start = startTimeStamp ? new Date(startTimeStamp) : undefined;
    const end = endTimeStamp ? new Date(endTimeStamp) : undefined;

    const query = {
      $and: [
        {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { _id: { $regex: search, $options: "i" } },
          ],
        },
        ...(start && end ? [{ createdAt: { $gte: start, $lte: end } }] : []),
      ],
    };

    const travellers = await Traveller.find(query)
      .sort({ createdAt: sortBy === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!travellers || travellers.length === 0) {
      return next(new ErrorResponse("No travellers found", 404));
    }

    return res.status(200).json({
      success: true,
      data: travellers,
    });
  }
);

export const deleteTraveller = asyncErrorHandler(async (req, res, next) => {
  const { travellerId } = req.params;
  const traveller = await Traveller.findByIdAndDelete(travellerId);
  if (!traveller) {
    return next(new ErrorResponse("Traveller not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Traveller deleted",
    data: traveller,
  });
});

export const getTravelerByID = asyncErrorHandler(async (req, res, next) => {
  const { travellerId } = req.params;
  const traveller = await Traveller.findById(travellerId);
  if (!traveller) {
    return next(new ErrorResponse("Traveller not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: traveller,
  });
});
