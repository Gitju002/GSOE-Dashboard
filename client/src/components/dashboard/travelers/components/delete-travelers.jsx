import React from "react";
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
  useDeleteTravelerMutation,
  useGetAllTravelersWithFilterQuery,
} from "@/store/services/traveler";
import { useNavigate } from "react-router-dom";

const DeleteTravelers = ({ id }) => {
  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const [deleteTraveler] = useDeleteTravelerMutation();
  const [loading, setLoading] = React.useState(false);
  const getTraveler = useGetAllTravelersWithFilterQuery();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { data, error } = await deleteTraveler(id);
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
        getTraveler.refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        status: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(dismiss, 3000);
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

export default DeleteTravelers;
