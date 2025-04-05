import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { FileCheck, Building2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormValues, formSchema } from "@/types/Types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSellerRequest } from "@/hooks/user/useSeller";
import { SellerRequestPayload } from "@/types/Types";

export const SellerApplicationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const userData = useSelector((state:RootState) => state.user.user);
  const {mutateAsync}= useSellerRequest();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isProfessionalDealer: false,
      name: userData?.name,
      phone: userData?.phone,
      address: "",
      identificationNumber: "",
      businessName: "",
      licenseNumber: "",
      taxID: "",
      website: "",
      yearsInBusiness: "",
      agreeToTerms: undefined,
    },
  });

  const isProfessionalDealer = form.watch("isProfessionalDealer");

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      console.log(data);
      const payload: SellerRequestPayload = {
        isProfessionalDealer: data.isProfessionalDealer,
        address: data.address,
        identificationNumber: data.identificationNumber,
        ...(data.isProfessionalDealer && {
          businessName: data.businessName,
          licenseNumber: data.licenseNumber,
          taxID: data.taxID,
          website: data.website,
          yearsInBusiness: data.yearsInBusiness,
        }),
      };

      const response = await mutateAsync(payload);
      if(response.success){
      toast({
        title: "Application submitted successfully",
        description: "We'll review your application and get back to you soon.",
        duration: 5000,
      });

      navigate("/profile");
    }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your application couldn't be submitted. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-[#333333] p-4 rounded-lg mb-6">
          <FormField
            control={form.control}
            name="isProfessionalDealer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-white font-medium">Professional Dealer</FormLabel>
                  <FormDescription>
                    Are you applying as a professional car dealer business?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="!bg-black data-[state=checked]:bg-[#3BE188] transition-colors relative"
                  >
                  </Switch>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information Fields */}
          <div className="space-y-4">
            {/* Read-only name field from Redux */}
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <Input
                value={userData?.name}
                readOnly
                className="bg-[#444444] border-[#555555] text-white cursor-not-allowed opacity-70"
              />
              <FormDescription>
                Name is pre-filled from your profile
              </FormDescription>
            </FormItem>

            {/* Read-only phone field from Redux */}
            <FormItem>
              <FormLabel className="text-white">Phone Number</FormLabel>
              <Input
                value={userData?.phone}
                readOnly
                className="bg-[#444444] border-[#555555] text-white cursor-not-allowed opacity-70"
              />
              <FormDescription>
                Phone is pre-filled from your profile
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your full address"
                      className="bg-[#333333] border-[#555555] text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identificationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">ID Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a government-issued ID number"
                      className="bg-[#333333] border-[#555555] text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Driver's license, passport, or other government ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Professional Dealer Fields (only shown if Professional Dealer is selected) */}
          {isProfessionalDealer && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your dealership name"
                        className="bg-[#333333] border-[#555555] text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Business License #</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="License number"
                          className="bg-[#333333] border-[#555555] text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Tax ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tax ID number"
                          className="bg-[#333333] border-[#555555] text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Website (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://yourdealership.com"
                          className="bg-[#333333] border-[#555555] text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsInBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Years in Business</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 5"
                          className="bg-[#333333] border-[#555555] text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#3BE188] data-[state=checked]:border-[#3BE188]"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">
                  I agree to the seller terms and conditions
                </FormLabel>
                <FormDescription>
                  By submitting this application, you agree to our <a href="#" className="text-[#3BE188] hover:underline">Terms of Service</a> and <a href="#" className="text-[#3BE188] hover:underline">Seller Guidelines</a>.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-2/3 lg:w-1/2 !bg-[#3BE188] !hover:opacity-60 text-opacity-100 text-lg py-6 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>

      {/* Application Process Steps */}
      <div className="mt-12 border-t border-[#333333] pt-8">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Application Process</h3>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-[#333333] p-6 rounded-lg">
            <div className="bg-[#444444] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="text-[#3BE188] h-6 w-6" />
            </div>
            <h4 className="text-white font-medium mb-2">Submit Application</h4>
            <p className="text-sm text-[#8E9196]">Complete and submit this form with your information.</p>
          </div>

          <div className="bg-[#333333] p-6 rounded-lg">
            <div className="bg-[#444444] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-[#3BE188] h-6 w-6" />
            </div>
            <h4 className="text-white font-medium mb-2">Review Process</h4>
            <p className="text-sm text-[#8E9196]">Our team will review your application within 1-3 business days.</p>
          </div>

          <div className="bg-[#333333] p-6 rounded-lg">
            <div className="bg-[#444444] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="text-[#3BE188] h-6 w-6" />
            </div>
            <h4 className="text-white font-medium mb-2">Get Approved</h4>
            <p className="text-sm text-[#8E9196]">Once approved, you'll be able to list and sell vehicles.</p>
          </div>
        </div>
      </div>
    </Form>
  );
};