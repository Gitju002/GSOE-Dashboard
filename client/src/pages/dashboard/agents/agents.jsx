import { useEffect } from "react";
import AgentForm from "@/components/dashboard/agents/agent-form";
import DataTable from "@/components/dashboard/agents/components/data-table";
import columns from "@/components/dashboard/agents/components/columns";
import { useSearchParams } from "react-router-dom";
import {
  useGetAgentByIdQuery,
  useGetAgentsQuery,
} from "@/store/services/agents";
import Loader from "@/components/loader/loader";
import { useToast } from "@/components/ui/use-toast";

const Agents = () => {
  const { toast, dismiss } = useToast();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const edit = searchParams.get("edit");

  const {
    data: agentData,
    isLoading: isAgentLoading,
    error: agentError,
  } = useGetAgentByIdQuery(edit, {
    skip: !edit,
  });

  const {
    data: agentsData,
    isLoading: isAgentsLoading,
    error: agentsError,
    refetch: refetchAgents,
  } = useGetAgentsQuery({ search });

  console.log("agentsData", agentsData);

  useEffect(() => {
    if (agentError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: agentError.data?.error || "An error occurred",
        status: "error",
      });
      setTimeout(dismiss, 5000);
    }
  }, [agentError, toast, dismiss]);

  // Refetch agents when not loading
  useEffect(() => {
    if (!isAgentsLoading) {
      refetchAgents();
    }
  }, [isAgentsLoading, refetchAgents]);

  // Watch for coin updates and refetch the table when coins change
  useEffect(() => {
    if (agentData?.data?.agents?.coins) {
      refetchAgents();
    }
  }, [agentData?.data?.agents?.coins, refetchAgents]);

  if (isAgentLoading || isAgentsLoading) return <Loader />;

  return (
    <section className="flex justify-center min-h-screen items-center py-6">
      <div className="m-4 max-w-7xl w-full shadow-md min-h-96 flex flex-wrap-reverse rounded-md p-4">
        <div className="px-2 max-lg:mt-2 lg:w-1/3 w-full">
          {/* Agent Form */}
          <AgentForm
            agent={agentData?.data || {}}
            params={searchParams.get("edit")}
            onSuccess={() => refetchAgents()} // Trigger refetch on form success
          />
        </div>
        <div className="px-2 lg:w-2/3 w-full">
          <h4 className="mb-2 lg:-mt-1.5 p-2 text-2xl uppercase font-semibold flex justify-center">
            Agents
          </h4>
          {/* Data Table */}
          <DataTable
            columns={columns}
            data={agentsError ? [] : agentsData?.data?.agents || []}
            agent={agentData}
          />
        </div>
      </div>
    </section>
  );
};

export default Agents;
