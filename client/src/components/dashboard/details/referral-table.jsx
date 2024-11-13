import { DataTable } from "./components/client-referral-table/data-table-referrel";
import { columns } from "./components/client-referral-table/columns-solo-referrel";

const ReferralTable = ({ referralData, refferalError }) => {
  return (
    <div className="container">
      <h4 className="mb-2 text-2xl uppercase font-semibold flex justify-center">
        Referral Bookings
      </h4>
      <DataTable
        columns={columns}
        data={refferalError ? [] : referralData?.data?.bookings || []}
        totalCount={referralData?.data?.totalBookings}
      />
    </div>
  );
};

export default ReferralTable;
