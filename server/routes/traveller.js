import express from "express";
import {
  deleteTraveller,
  getAllTravellerWithFilter,
  registerTraveller,
  updateTraveller,
  getTravelerByID,
} from "../controller/traveller.js";
import auth from "../auth/auth.js";
import {
  travellerValidation,
  travellerValidationUpdate,
} from "../middleware/validation/traveller-validation.js";

const router = express.Router();

router.use(auth.isAuthenticated, auth.isOperator);

router.post("/register", travellerValidation, registerTraveller);
router.put("/update/:travellerId", travellerValidationUpdate, updateTraveller);
router.get("/get", getAllTravellerWithFilter);
router.get("/get/:travellerId", getTravelerByID);
router.delete("/delete/:travellerId", deleteTraveller);

export default router;
