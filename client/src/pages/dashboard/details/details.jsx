import ReferralTable from "@/components/dashboard/details/referral-table";
import SoloTable from "@/components/dashboard/details/solo-table";
import Loader from "@/components/loader/loader";
import {
  useGetBookingsDirectQuery,
  useGetBookingsReferralQuery,
} from "@/store/services/booking";
import { useSearchParams } from "react-router-dom";

const Details = () => {
  const [searchParams] = useSearchParams();

  const {
    data: soloData,
    isLoading: isSoloLoading,
    isError: soloError,
  } = useGetBookingsDirectQuery({
    page: searchParams.get("sp") || null,
    search: searchParams.get("ss") || null,
  });

  const {
    data: referralData,
    isLoading: isRefferalLoading,
    isError: refferalError,
  } = useGetBookingsReferralQuery({
    page: searchParams.get("rp") || null,
    search: searchParams.get("rs") || null,
  });

  if (isSoloLoading || isRefferalLoading) return <Loader />;
  return (
    <section className="min-h-screen flex justify-start items-center py-12 flex-col">
      <SoloTable soloData={soloData} soloError={soloError} />
      <ReferralTable
        referralData={referralData}
        refferalError={refferalError}
      />
    </section>
  );
};

export default Details;
