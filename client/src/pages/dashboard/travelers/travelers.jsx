import React, { useEffect } from "react";
import DataTable from "@/components/dashboard/travelers/components/data-table";
import columns from "@/components/dashboard/travelers/components/columns";
import TravelerForm from "@/components/dashboard/travelers/traveler-form";
import {
  useGetAllTravelersWithFilterQuery,
  useGetTravelerByIdQuery,
} from "@/store/services/traveler";
import Loader from "@/components/loader/loader";
import { useSearchParams } from "react-router-dom";

const Travelers = () => {
  const [searchParams] = useSearchParams();

  const {
    data: travelers,
    isLoading: travelerLoading,
    error: travelerError,
    refetch: refetchTravelers,
  } = useGetAllTravelersWithFilterQuery({ search: null });

  const editId = searchParams.get("edit");
  const { data: travelerData, isLoading: travelerDataLoading } =
    useGetTravelerByIdQuery(editId, {
      skip: !editId,
    });

  useEffect(() => {
    if (!travelerLoading && travelers) {
      refetchTravelers();
    }
  }, [refetchTravelers, travelerLoading, travelers]);

  if (travelerLoading || travelerDataLoading) return <Loader />;

  // console.log(travelers);

  return (
    <section className="flex justify-center min-h-screen items-center py-6">
      <div className="m-4 max-w-7xl w-full shadow-md min-h-96 flex flex-wrap-reverse rounded-md p-4">
        <div className="px-2 max-lg:mt-2 lg:w-1/3 w-full">
          <TravelerForm
            onSuccess={() => refetchTravelers()}
            traveler={travelerData?.data || {}}
            params={searchParams.get("edit")}
          />
        </div>
        <div className="px-2 lg:w-2/3 w-full">
          <h4 className="mb-2 lg:-mt-1.5 p-2 text-2xl uppercase font-semibold flex justify-center">
            Travelers
          </h4>
          <DataTable
            columns={columns}
            data={travelerError ? [] : travelers?.data || []}
            traveler={travelerData}
          />
        </div>
      </div>
    </section>
  );
};

export default Travelers;
