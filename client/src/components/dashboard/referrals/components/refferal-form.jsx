import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReactSelect from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetAgentsQuery } from "@/store/services/agents";
import Loader from "@/components/loader/loader";
import { useGetAllTravelersWithFilterQuery } from "@/store/services/traveler";
import { useCreateBookingMutation } from "@/store/services/booking";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  agent: z.object({
    id: z.string({
      message: "Agent is required.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string({
      message: "Phone number is required.",
    }),
  }),
  traveler: z.object({
    id: z.string({ message: "Traveler is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string({ message: "Phone number is required." }),
  }),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Amount must be a positive number." })
  ),
  baseAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Base amount must be a positive number." })
  ),
  destination: z.string({ message: "Destination is required." }).min(1, {
    message: "Destination is required.",
  }),
  numberOfChildren: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Number of children is required." })
  ),
  numberOfAdults: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Number of adults is required." })
  ),
  package: z.string({ message: "Package is required." }).min(1, {
    message: "Package is required.",
  }),
  journeyStart: z
    .date()
    .nullable()
    .refine((date) => date, {
      message: "Journey start date is required.",
    }),
  journeyEnd: z
    .date()
    .nullable()
    .refine((date) => date, {
      message: "Journey end date is required.",
    }),
});

const ReferralForm = () => {
  const navigate = useNavigate();
  const [currentError, setCurrentError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profit, setProfit] = useState(0);
  const { toast, dismiss } = useToast();
  const { data: agents, isLoading: isAgentsLoading } = useGetAgentsQuery({
    search: null,
  });
  const { data: travelersData, isLoading: isTravelersLoading } =
    useGetAllTravelersWithFilterQuery({
      search: null,
    });

  const [createBooking] = useCreateBookingMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent: {
        id: "",
        email: "",
        phone: "",
      },
      traveler: {
        id: "",
        email: "",
        phone: "",
      },
      amount: 0,
      baseAmount: 0,
      numberOfChildren: 0,
      numberOfAdults: 0,
      journeyStart: null,
      journeyEnd: null,
      destination: "",
      package: "",
    },
  });

  useEffect(() => {
    const agentId = form.watch("agent.id");
    const travelerId = form.watch("traveler.id");
    const amount = parseFloat(form.watch("amount")) || 0;
    const baseAmount = parseFloat(form.watch("baseAmount")) || 0;

    if (agentId) {
      const selectedAgent = agents?.data?.agents.find(
        (agent) => agent._id === agentId
      );
      if (selectedAgent) {
        form.setValue("agent.email", selectedAgent.email);
        form.setValue("agent.phone", selectedAgent.phone);
      }
    }

    if (travelerId) {
      const selectedTraveler = travelersData?.data?.find(
        (t) => t._id === travelerId
      );
      if (selectedTraveler) {
        form.setValue("traveler.email", selectedTraveler.email);
        form.setValue("traveler.phone", selectedTraveler.phone);
      }
    }
    if (baseAmount !== 0) {
      setProfit(((amount - baseAmount) / baseAmount) * 100);
    } else {
      setProfit(0);
    }
  }, [
    form.watch("agent.id"),
    form.watch("traveler.id"),
    agents,
    travelersData,
  ]);

  const onSubmit = async (formData) => {
    try {
      const response = await createBooking({
        travellerId: formData.traveler.id,
        agentId: formData.agent.id,
        amount: formData.amount,
        baseAmount: formData.baseAmount,
        numberOfChildren: formData.numberOfChildren,
        numberOfAdults: formData.numberOfAdults,
        startDate: formData.journeyStart,
        endDate: formData.journeyEnd,
        venue: formData.destination,
        packageType: formData.package,
      });

      if (response?.data?.success === true) {
        toast({
          title: "Booking created",
          description: `${response?.data?.data?.usedCreditNote} amount has been deducted from the traveler's refund and the rest of the amount is ${response?.data?.traveller?.refund}`,
          status: "success",
        });
        if (response?.data?.data?.dueAmount == 0) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/emi?bookingId=" + response?.data?.data?._id);
        }
      } else {
        const errorMessage =
          response?.error?.data?.error || "Unexpected response structure";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
        });
      }
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: error.data.error,
        status: "error",
      });
      return { error };
    } finally {
      setTimeout(() => {
        dismiss();
      }, 6000);
    }
  };

  const handleFormSubmit = async (data) => {
    setCurrentError(null);
    try {
      setLoading(true);
      const response = await onSubmit(data);
      if (response.data.success) {
        form.reset();
      }
    } catch (err) {
      setCurrentError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isAgentsLoading || isTravelersLoading) return <Loader />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full px-4 mx-auto"
      >
        {currentError && (
          <div className="col-span-1 sm:col-span-2 mb-4 text-red-500 text-center">
            {currentError}
          </div>
        )}

        <FormField
          control={form.control}
          name="agent.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-start">
                Select an agent
              </FormLabel>
              <FormControl>
                <ReactSelect
                  className="text-start"
                  placeholder="Select an agent"
                  options={
                    (agents?.data?.agents &&
                      agents.data.agents.map((agent) => ({
                        value: agent._id,
                        label: agent.fullName,
                      }))) ||
                    []
                  }
                  onChange={(option) => field.onChange(option?.value)}
                  noOptionsMessage={() => "No agent found"}
                  maxMenuHeight={150}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="traveler.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-start">
                Select a traveler
              </FormLabel>
              <FormControl>
                <ReactSelect
                  className="text-start"
                  placeholder="Select a traveler"
                  options={
                    (travelersData?.data &&
                      travelersData.data.map((traveler) => ({
                        value: traveler._id,
                        label: traveler.fullName,
                      }))) ||
                    []
                  }
                  onChange={(option) => field.onChange(option?.value)}
                  noOptionsMessage={() => "No travelers found"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("agent.id") && form.watch("traveler.id") ? (
          <div className="space-y-4 my-4 col-span-1 sm:col-span-2 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agent.email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Agent Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter agent's email..."
                        type="email"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="traveler.email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Traveler Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter traveler's email..."
                        type="email"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agent.phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Agent Phone No
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter agent's phone number..."
                        type="tel"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="traveler.phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Traveler Phone No
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter traveler's phone number..."
                        type="tel"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numberOfChildren"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Number of Children
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the number of children..."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfAdults"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Number of Adults
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the number of adults..."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-start">
                    Destination Details
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the destination..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-start">Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the package..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="journeyStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-start">
                      Journey Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) =>
                            date < new Date().setHours(0, 0, 0, 0)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="journeyEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-start">
                      Journey End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={form.getValues("journeyStart") === null}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            form.getValues("journeyStart") && date < Date.now()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseAmount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">
                      Base Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the base amount..."
                        type="text"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const amount =
                            parseFloat(form.getValues("amount")) || 0;
                          const baseAmount = parseFloat(e.target.value) || 0;
                          setProfit(((amount - baseAmount) / baseAmount) * 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-start">Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the amount..."
                        type="text"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const baseAmount =
                            parseFloat(form.getValues("baseAmount")) || 0;
                          const amount = parseFloat(e.target.value) || 0;
                          setProfit(((amount - baseAmount) / baseAmount) * 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1 sm:col-span-2 w-full">
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-start">Profit (%)</FormLabel>
                <FormControl>
                  <Input
                    value={profit.toFixed(2)}
                    type="number"
                    disabled
                    aria-label="Calculated profit"
                  />
                </FormControl>
              </FormItem>
            </div>

            <div className="col-span-1 sm:col-span-2 w-full">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        ) : null}
      </form>
    </Form>
  );
};

export default ReferralForm;
