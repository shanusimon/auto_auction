import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CarImagesSection } from "./CarImageSelection";
import { CarDetailsForm } from "./CarDeatailsForm";
import { CarSellingTips } from "./CarListingTips";
import { CarFormValues } from "@/types/CarFormTypes";
import { carFormSchema } from "@/types/CarFormTypes";
import { uploadCarImageCloudinary } from "@/utils/cloudinaryImageUpload";
import { useCarRegister } from "@/hooks/user/useSeller";
import { CreateCarDTO } from "@/types/CarFormTypes";

export const CarListingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carImages, setCarImages] = useState<File[]>([]);
  const navigate = useNavigate()

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      vehicleRegion: "",
      vehicleNumber: "",
      year: new Date().getFullYear(),
      mileage: "" as any,
      reservePrice: undefined,
      location: "",
      bodyType: "",
      description: "",
      fuel: "",
      transmission: "",
      ExteriorColor: "",
      InteriorColor: "",
      auctionDuration: "3",
    },
  });
  const { mutateAsync: registerCar } = useCarRegister();

  const onSubmit = async (data: CarFormValues, resetImages: () => void) => {
    setIsSubmitting(true);

    if (carImages.length !== 5) {
      toast({
        title: "Invalid number of images",
        description: "Please upload exactly 5 images of your car.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        carImages.map((file) => uploadCarImageCloudinary(file))
      );

      if (uploadedImages.some((url) => url === null)) {
        toast({
          title: "Failed to upload",
          description: "Some images failed to upload",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const payload: CreateCarDTO = {
        ...data,
        vehicleNumber: `${data.vehicleRegion}-${data.vehicleNumber}`,
        mileage: Number(data.mileage),
        reservedPrice: Number(data.reservePrice),
        exteriorColor: data.ExteriorColor,
        interiorColor: data.InteriorColor,
        images: uploadedImages as string[],
      };

      console.log(payload);

      await registerCar(payload);

      toast({
        title: "Car listed successfully!",
        description: "Your car has been listed on our platform.",
      });

      form.reset();
      resetImages();
      navigate('/');
    } catch (error: any) {
      console.error("Error submitting car listing:", error);

      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;

        toast({
          title: message || "Failed to list car",
          description: errors
            ? errors.map((err: { message: string }) => err.message).join(", ")
            : "Please check your details and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to list car",
          description:
            error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
        <h1 className="text-3xl font-bold text-white mb-3">List Your Car</h1>
        <p className="text-[#8E9196] max-w-lg mx-auto">
          Fill out the details below to list your car for sale on our platform.
        </p>
      </div>

      <div
        className="opacity-0 translate-y-4"
        style={{
          animation: "fade-slide-up 0.6s ease-out 0.3s forwards",
        }}
      >
        <CarImagesSection
          carImages={carImages}
          setCarImages={setCarImages}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data, () => setCarImages([])))} className="space-y-6">
          <div
            className="opacity-0 translate-y-4"
            style={{
              animation: "fade-slide-up 0.6s ease-out 0.5s forwards",
            }}
          >
            <CarDetailsForm form={form} />
          </div>

          <div className="mt-8 bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Auction Duration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">How long should your auction last?</label>
                <select
                  {...form.register("auctionDuration")}
                  className="w-full md:w-1/3 bg-[#1A1A1A] border border-[#333333] text-white rounded px-3 py-2"
                  defaultValue="3"
                >
                  <option value="0.002">3 minutes (testing only)</option>
                  <option value="0.042">1 hour (minimum)</option>
                  <option value="0.25">6 hours</option>
                  <option value="0.5">12 hours</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days (maximum)</option>
                </select>
                {form.formState.errors.auctionDuration && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.auctionDuration.message}
                  </p>
                )}
                <p className="text-[#8E9196] text-sm mt-1">
                  Set the duration for your car auction. Auctions can run from 3 minutes to 6 days.
                </p>
              </div>
            </div>
          </div>
          <div
            className="opacity-0 translate-y-4"
            style={{
              animation: "fade-slide-up 0.6s ease-out 0.7s forwards",
            }}
          >
            <Button
              type="submit"
              className="w-full md:w-1/2 mx-auto  !bg-[#3BE188] text-black text-lg font-medium py-6 hover:opacity-90 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Listing Car...</span>
                </>
              ) : "List My Car"}
            </Button>
          </div>
        </form>
      </Form>

      <div
        className="opacity-0 translate-y-4"
        style={{
          animation: "fade-slide-up 0.6s ease-out 0.9s forwards",
        }}
      >
        <CarSellingTips />
      </div>
    </div>
  );
};