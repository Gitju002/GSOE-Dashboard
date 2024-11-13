import { DataTable } from "./components/client-solo-table/data-table-solo";
import { columns } from "./components/client-solo-table/columns-solo";

const SoloTable = ({ soloData, soloError }) => {
  return (
    <div className="container mx-auto">
      <h4 className="pb-4 text-2xl uppercase font-semibold flex justify-center">
        Direct Bookings
      </h4>
      <DataTable
        columns={columns}
        data={soloError ? [] : soloData?.data?.bookings || []}
        totalCount={soloData?.data?.totalBookings}
      />
    </div>
  );
};

export default SoloTable;
