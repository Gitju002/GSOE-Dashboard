import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeleteAgentMutation,
  useGetAgentsQuery,
} from "@/store/services/agents";

const DeleteAgent = ({ id }) => {
  const [deleteAgent] = useDeleteAgentMutation();
  const { toast, dismiss } = useToast();
  const [loading, setLoading] = useState(false);
  const getAgents = useGetAgentsQuery();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data, error } = await deleteAgent(id);

      if (error) {
        toast({
          title: "Error",
          description: error.data?.error || "An error occurred",
          status: "error",
        });
        return;
      }

      if (data.success === true) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
        });
        getAgents.refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the agent",
      });
    } finally {
      setLoading(false);
      setTimeout(dismiss, 5000);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive" className="h-8 w-8">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            agent's account and remove all data associated with it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAgent;
