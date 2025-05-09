import {
  UseFormReturn
} from "react-hook-form";
import {
  Calendar,
  Car,
  DollarSign,
  Fuel,
  Gauge,
  Info,
  MapPin,
  LayoutGrid,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CreatableBrandCombobox } from "./BandsTable";
import { CarFormValues } from "@/types/CarFormTypes";

interface CarDetailsFormProps {
  form: UseFormReturn<CarFormValues>;
}

export const CarDetailsForm = ({
  form
}: CarDetailsFormProps) => {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-md backdrop-blur-sm animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Car className="text-[#3BE188]" size={24} />
          Car Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* Listing Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Listing Title</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Info className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 2020 BMW 3 Series, Low Mileage"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Make */}
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Make</FormLabel>
              <div className="relative mt-1">
                <FormControl>
                  <CreatableBrandCombobox value={field.value} onChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Model</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Car className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 3 Series, Camry"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Vehicle Number - NEW FIELD */}
        <FormField
          control={form.control}
          name="vehicleRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Vehicle Number</FormLabel>
              <div className="flex gap-2 mt-1">
                {/* Region part */}
                <FormControl>
                  <Input
                    placeholder="KL"
                    maxLength={2}
                    className="bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11 w-1/3"
                    {...field}
                  />
                </FormControl>

                {/* Number part */}
                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        placeholder="12345"
                        maxLength={5}
                        inputMode="numeric"
                        pattern="\d{5}"
                        className="bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11 flex-1"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Validation messages */}
              <div className="flex gap-2 mt-1">
                <FormMessage name="vehicleRegion" className="text-red-500 w-1/3" />
                <FormMessage name="vehicleNumber" className="text-red-500 flex-1" />
              </div>

              <FormDescription className="text-[#8E9196] text-xs mt-1">
                Enter your vehicle registration code (e.g., KL 12345)
              </FormDescription>
            </FormItem>
          )}
        />


        {/* Year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Year</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Calendar className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 2020"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Mileage */}
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Mileage</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Gauge className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 45000"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Reserve Price - OPTIONAL */}
        <FormField
          control={form.control}
          name="reservePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">
                Reserve Price ($) <span className="text-[#8E9196] text-xs ml-1">(Optional)</span>
              </FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <DollarSign className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 22000"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormDescription className="text-[#8E9196] text-xs mt-1">
                Minimum amount you're willing to accept. Your listing won't sell below this price.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Location</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <MapPin className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Los Angeles, CA"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Fuel Type */}
        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Fuel Type</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                  <Fuel className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10 bg-[#1A1A1A] border-[#333333] text-white h-11">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Body Type */}
        <FormField
          control={form.control}
          name="bodyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Body Type</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                  <LayoutGrid className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10 bg-[#1A1A1A] border-[#333333] text-white h-11">
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="wagon">Wagon</SelectItem>
                      <SelectItem value="limousine">Limousine</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Transmission */}
        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Transmission</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                  <Car className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10 bg-[#1A1A1A] border-[#333333] text-white h-11">
                      <SelectValue placeholder="Select transmission type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="semi_automatic">Semi-Automatic</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Exterior Color */}
        <FormField
          control={form.control}
          name="ExteriorColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Exterior Color</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Info className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Black, White, Silver"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Interior Color */}
        <FormField
          control={form.control}
          name="InteriorColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-sm font-medium">Interior Color</FormLabel>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Info className="text-[#8E9196] h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Black, White, Beige"
                    className="pl-10 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors h-11"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="mt-8">
            <FormLabel className="text-white text-sm font-medium">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a detailed description of your car including its condition, features, history, etc."
                className="min-h-32 bg-[#1A1A1A] border-[#333333] text-white focus:ring-[#3BE188] focus:border-[#3BE188] transition-colors mt-1"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-[#8E9196] text-xs mt-1">
              Minimum 30 characters. A good description increases your chances of selling quickly.
            </FormDescription>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
};