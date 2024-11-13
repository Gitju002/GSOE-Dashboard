import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SoloForm from "./components/solo-form";
import ReferralForm from "./components/refferal-form";

const ReferralSelect = ({ travelers, agents }) => {
  const [selected, setSelected] = useState("Solo");

  return (
    <>
      <RadioGroup
        defaultValue="Solo"
        className="flex gap-4 mb-4 flex-wrap justify-center items-center"
        onValueChange={(value) => setSelected(value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Solo" id="Solo" />
          <Label htmlFor="Solo">Direct Booking (No referrals)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Referral" id="Referral" />
          <Label htmlFor="Referral">
            Referral Booking (Get coins for referrals)
          </Label>
        </div>
      </RadioGroup>
      <div className="mt-6">
        {selected === "Solo" && <SoloForm />}
        {selected === "Referral" && <ReferralForm />}
      </div>
    </>
  );
};

export default ReferralSelect;
