import { v4 as uuidV4 } from "uuid";
import { Traveller } from "../model/traveller.js";
import { User } from "../model/user.js";
import { Agent } from "../model/agent.js";
import { Booking } from "../model/booking.js";
import { Emi } from "../model/emi.js";

export const genrateCustomizedTravellerId = async () => {
  while (true) {
    const uuid = uuidV4().replace(/\D/g, "");
    const smallUuid = uuid.slice(0, 8);
    const customizedId = `TRV-${smallUuid}`;
    const existance = await Traveller.findOne({ _id: customizedId });
    if (existance) {
      continue;
    }
    return customizedId;
  }
};

export const genrateCustomizedUserId = async () => {
  while (true) {
    const uuid = uuidV4().replace(/\D/g, "");
    const smallUuid = uuid.slice(0, 8);
    const customizedId = `USR-${smallUuid}`;
    const existance = await User.findOne({ _id: customizedId });
    if (existance) {
      continue;
    }
    return customizedId;
  }
};

export const genrateCustomizedAgentId = async () => {
  while (true) {
    const uuid = uuidV4().replace(/\D/g, "");
    const smallUuid = uuid.slice(0, 8);
    const customizedId = `AGT-${smallUuid}`;
    const existance = await Agent.findOne({ _id: customizedId });
    if (existance) {
      continue;
    }
    return customizedId;
  }
};


export const genrateCustomizedBookingId = async () => {
  while (true) {
    const uuid = uuidV4().replace(/\D/g, "");
    const smallUuid = uuid.slice(0, 8);
    const customizedId = `BKG-${smallUuid}`;
    const existance = await Booking.findOne({ _id: customizedId });
    if (existance) {
      continue;
    }
    return customizedId;
  }
}

export const genrateCustomizedTransactionId = async () => {
  while (true) {
    const uuid = uuidV4().replace(/\D/g, "");
    const smallUuid = uuid.slice(0, 8);
    const customizedId = `TRN-${smallUuid}`;
    const existance = await Booking.findOne({ _id: customizedId });
    if (existance) {
      continue;
    }
    return customizedId;
  }
}

export const generateCustomizedEmiId = async () => {
  while (true) {
    const uuid = uuidV4().replace(/\D/g, "");
    const smallUuid = uuid.slice(0, 8);
    const customizedId = `EMI-${smallUuid}`;
    const existance = await Emi.findOne({ _id: customizedId });
    if (existance) {
      continue;
    }
    return customizedId;
  }
}