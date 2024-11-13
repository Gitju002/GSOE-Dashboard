import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarDaysIcon,
  Pencil,
  SendHorizonal,
  Trash,
  Verified,
  X,
  ForwardIcon,
} from "lucide-react";
import { useGetEmiDataQuery } from "@/store/services/transaction";
import Loader from "@/components/loader/loader";
import {
  useAddEmisMutation,
  useDeleteEmiMutation,
  useGetSingleBookingByIdQuery,
  useUpdateEmiMutation,
} from "@/store/services/booking";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { cn, formatAmount, formatdate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCreateOrderMutation } from "@/store/services/payment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  amount: z.string().optional(),
  date: z
    .date({
      message: "Invalid date",
    })
    .optional(),
});

const Emi = () => {
  const [openModal, setOpenModal] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchParams] = useSearchParams();
  const [editEmi, setEditEmi] = useState(null);
  const [originalAmount, setOriginalAmount] = useState("");
  const {
    data: booking,
    isLoading: bookingLoading,
    refetch: refetchBooking,
  } = useGetSingleBookingByIdQuery(searchParams.get("bookingId"));
  const [updateEmi] = useUpdateEmiMutation();
  const [deleteEmi] = useDeleteEmiMutation();
  const [amount, setAmount] = useState("");
  const [emiId, setEmitId] = useState(null);
  const [date, setDate] = useState(null);
  const { toast, dismiss } = useToast();
  const [addEmi] = useAddEmisMutation();
  const {
    data: emis,
    isLoading: emiLoading,
    refetch: refetchEmis,
  } = useGetEmiDataQuery(searchParams.get("bookingId"));
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (editEmi && emis?.data) {
      const emiToEdit = emis.data.find((emi) => emi._id === editEmi);
      if (emiToEdit) {
        setOriginalAmount(emiToEdit.amount.toString());
        setAmount(emiToEdit.amount.toString());
        setDate(emiToEdit.date);
      }
    }
  }, [editEmi, emis]);

  const handleEditClick = (emiId) => {
    if (editEmi === emiId) {
      setEditEmi(null);
      setAmount(originalAmount);
    } else {
      setEditEmi(emiId);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await form.handleSubmit(onSubmit)(data);
    } catch (errors) {
      errors.forEach((error) => {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.message,
        });
        setTimeout(dismiss, 5000);
      });
    }
  };

  async function onSubmit(values) {
    try {
      if (!values.amount || !values.date) {
        throw new Error("Amount and date are required");
      }

      //check the amount is a number
      if (isNaN(values.amount)) {
        throw new Error("Amount should be a number");
      }

      //check the amount is greater than 0
      if (Number(values.amount) <= 0) {
        throw new Error("Amount should be greater than 0");
      }

      const { data, error } = await addEmi({
        amount: Number(values.amount),
        date: values.date,
        bookingId: searchParams.get("bookingId"),
      });

      if (data) {
        toast({
          title: "Success",
          description: "EMI added successfully",
        });
        refetchBooking();
        refetchEmis();
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Error in adding EMI",
          description: error.data.error || "Something went wrong",
        });
        return;
      }

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setTimeout(dismiss, 5000);
    }
  }

  const handlePay = async (emiId) => {
    try {
      if (!paymentMethod || paymentMethod.length < 1) {
        throw new Error("Payment method is required");
      }
      const { data, error } = await createOrder({
        emiId: emiId,
        paymentMethod: paymentMethod,
        currency: "INR",
        description: "Payment for tour!",
      });

      if (data) {
        toast({
          title: "Success",
          description: "Order created successfully",
        });

        refetchBooking();
        refetchEmis();
        if (paymentMethod === "CASH") {
          setOpenModal(false);
        } else {
          window.open(data.data.short_url, "_blank");
        }
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.data.error || "Something went wrong",
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Something went wrong while creating order",
      });
    } finally {
      setTimeout(dismiss, 5000);
    }
  };

  const sharePaymentLink = async (emiId) => {
    try {
      const { data, error } = await createOrder({
        emiId: emiId,
        paymentMethod: "ONLINE",
        currency: "INR",
        description: "Payment for tour!",
      });

      if (data) {
        toast({
          title: "Success",
          description: "Payment Link successfully copied to clipboard",
        });

        refetchBooking();
        refetchEmis();
        navigator.clipboard.writeText(data.data.short_url);
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.data.error || "Something went wrong",
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Something went wrong while creating order",
      });
    } finally {
      setTimeout(dismiss, 5000);
    }
  };

  const deleteEmiHandler = async (id) => {
    try {
      const { data, error } = await deleteEmi(id);

      if (data) {
        toast({
          title: "Success",
          description: "EMI deleted successfully",
        });

        refetchBooking();
        refetchEmis();
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.data.error || "Something went wrong",
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setEditEmi(null);
      setTimeout(dismiss, 5000);
    }
  };

  const updateEmiHandler = async (id) => {
    try {
      const { data, error } = await updateEmi({
        bookingId: id,
        emi: {
          amount: Number(amount),
          date: date,
        },
      });

      if (data) {
        toast({
          title: "Success",
          description: "EMI updated successfully",
        });

        refetchBooking();
        refetchEmis();
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.data.error || "Something went wrong",
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setEditEmi(null);
      setTimeout(dismiss, 5000);
    }
  };

  if (emiLoading || bookingLoading) return <Loader />;

  if (!searchParams.get("bookingId")) return null;

  return (
    <section className="flex justify-center items-center min-h-screen ">
      <div className="max-w-screen-md w-full mx-6 ">
        <h3 className="text-5xl font-bold uppercase text-center mb-6">
          Payment Terms
        </h3>
        <p className="text-center mb-4 font-medium text-zinc-700 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae,
        </p>

        <div className="flex items-center w-full border rounded-md mb-4">
          <div className="w-full text-center p-2 border-r">
            {booking?.data?.travellerId?._id || booking?.data?.travellerId}
          </div>
          <div className="w-full text-center p-2 border-r">
            {booking?.data?.agentId?._id || booking?.data?.agentId}
          </div>
          <div className="w-full text-center p-2">
            {formatAmount(booking?.data?.dueAmount)} (Due Amount)
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex gap-2 my-2 items-center w-full">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel hidden>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel hidden>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              formatdate(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              const maxDate = new Date(
                                today.getFullYear() + 2,
                                today.getMonth(),
                                today.getDate()
                              );
                              return date < today || date > maxDate;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Add EMI</Button>
            </div>
          </form>
        </Form>
        <div className="relative mt-6 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {emis?.data?.length > 0 &&
                emis.data.map((emi) => (
                  <tr key={emi._id} className="bg-white border-b">
                    <td className="px-6 py-4">
                      <Input
                        value={
                          editEmi === emi._id
                            ? amount
                            : formatAmount(emi.amount)
                        }
                        disabled={editEmi !== emi._id}
                        className={cn(
                          "hover:shadow-none focus:shadow-none focus-visible:ring-0 outline-none p-1 bg-transparent",
                          editEmi === emi._id
                            ? " border-transparent rounded-none border-b border-b-gray-800"
                            : "border-none border-transparent"
                        )}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {editEmi === emi._id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {date ? (
                                formatdate(date)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                setDate(date);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        formatdate(emi.date)
                      )}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center">
                      {emi.status === "PAID" ? (
                        <div
                          className="flex gap-3 items-center justify-center bg-green-500 p-2 w-20 rounded-md text-white hover:bg-green-600 cursor-pointer"
                          title="Paid"
                        >
                          PAID <Verified className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex gap-3 items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleEditClick(emi._id)}
                          >
                            {editEmi === emi._id ? "Cancel" : "Edit"}
                            <Pencil className="ml-2 h-4 w-4" />
                          </Button>
                          {editEmi === emi._id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => updateEmiHandler(emi._id)}
                              >
                                Save
                                <Verified className="ml-2 h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => deleteEmiHandler(emi._id)}
                              >
                                Delete
                                <Trash className="ml-2 h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Dialog
                                open={openModal}
                                onOpenChange={setOpenModal}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                      setEmitId(emi._id);
                                    }}
                                  >
                                    Pay Now
                                    <SendHorizonal className="ml-2 h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Payment Method Selection
                                    </DialogTitle>
                                    <DialogDescription>
                                      Please choose a payment method to proceed
                                      with your transaction.
                                    </DialogDescription>
                                    <div className="py-2">
                                      <Select
                                        onValueChange={(value) =>
                                          setPaymentMethod(value)
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select a payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="CASH">
                                            <div className="flex gap-2 items-center">
                                              Cash
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="ONLINE">
                                            Online
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setOpenModal(false)}
                                      >
                                        Cancel
                                        <X className="ml-2 h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => {
                                          if (emiId) {
                                            handlePay(emiId);
                                          } else {
                                            toast({
                                              variant: "destructive",
                                              title: "Error",
                                              description:
                                                "Please select a emi id",
                                            });
                                          }
                                        }}
                                      >
                                        Pay Now
                                        <SendHorizonal className="ml-2 h-4 w-4" />
                                      </Button>
                                    </div>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                              <div>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal"
                                  onClick={() => {
                                    if (emi._id) {
                                      sharePaymentLink(emi._id);
                                    } else {
                                      toast({
                                        variant: "destructive",
                                        title: "Error",
                                        description: "Please select a emi id",
                                      });
                                    }
                                  }}
                                >
                                  Share <ForwardIcon className="ml-2 h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Emi;
