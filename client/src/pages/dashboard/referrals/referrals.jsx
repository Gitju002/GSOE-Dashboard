import ReferralSelect from "@/components/dashboard/referrals/referrals-select";
import React from "react";

const Referrals = () => {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="p-2 my-2 md:text-6xl text-4xl uppercase font-semibold flex justify-center">
          CREATE A TOUR
        </h1>
        <p className="text-muted-foreground mb-4 sm:text-base text-sm">
          Choose the type of tour you want to make
        </p>
        <ReferralSelect />
      </div>
    </section>
  );
};

export default Referrals;
