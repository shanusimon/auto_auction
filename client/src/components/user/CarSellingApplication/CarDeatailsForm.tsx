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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 shadow-lg backdrop-blur-sm animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
          <Car className="text-[#3BE188]" size={28} />
          Car Details
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        {/* Listing Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Listing Title
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Info className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 2020 BMW 3 Series, Low Mileage"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Make */}
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Make
              </FormLabel>
              <FormControl>
                <div className="h-12">
                  <CreatableBrandCombobox value={field.value} onChange={field.onChange} />
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Model
              </FormLabel>
              <div className="relative">
                {/* Icon container */}
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10 mb-3">
                  <Car className="text-zinc-400 h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 3 Series, Camry"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Vehicle Number */}
        <FormField
          control={form.control}
          name="vehicleRegion"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Vehicle Number
              </FormLabel>
              <div className="flex gap-3">
                {/* Region part */}
                <FormControl>
                  <Input
                    placeholder="KL"
                    maxLength={2}
                    className="w-20 h-12 bg-zinc-950/80 border-zinc-700 text-white text-center placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200 uppercase"
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
                        className="flex-1 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </div>
              <FormDescription className="text-zinc-400 text-xs">
                Enter your vehicle registration code (e.g., KL 12345)
              </FormDescription>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Year
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Calendar className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 2020"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Mileage */}
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Mileage
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Gauge className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 45000"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Reserve Price */}
        <FormField
          control={form.control}
          name="reservePrice"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Reserve Price ($)
                <span className="text-zinc-400 text-xs ml-2 font-normal">(Optional)</span>
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <DollarSign className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. 22000"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormDescription className="text-zinc-400 text-xs">
                Minimum amount you're willing to accept. Your listing won't sell below this price.
              </FormDescription>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-4">
                Location
              </FormLabel>
              <div className="relative">
                {/* Icon container */}
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10 mb-6">
                  <MapPin className="text-zinc-400 h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Los Angeles, CA"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Fuel Type */}
        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Fuel Type
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                  <Fuel className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200">
                      <SelectValue placeholder="Select fuel type" className="text-zinc-500" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="gasoline" className="text-white hover:bg-zinc-800">Gasoline</SelectItem>
                      <SelectItem value="diesel" className="text-white hover:bg-zinc-800">Diesel</SelectItem>
                      <SelectItem value="electric" className="text-white hover:bg-zinc-800">Electric</SelectItem>
                      <SelectItem value="hybrid" className="text-white hover:bg-zinc-800">Hybrid</SelectItem>
                      <SelectItem value="plugin_hybrid" className="text-white hover:bg-zinc-800">Plug-in Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Body Type */}
        <FormField
          control={form.control}
          name="bodyType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Body Type
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                  <LayoutGrid className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200">
                      <SelectValue placeholder="Select body type" className="text-zinc-500" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="sedan" className="text-white hover:bg-zinc-800">Sedan</SelectItem>
                      <SelectItem value="suv" className="text-white hover:bg-zinc-800">SUV</SelectItem>
                      <SelectItem value="coupe" className="text-white hover:bg-zinc-800">Coupe</SelectItem>
                      <SelectItem value="convertible" className="text-white hover:bg-zinc-800">Convertible</SelectItem>
                      <SelectItem value="wagon" className="text-white hover:bg-zinc-800">Wagon</SelectItem>
                      <SelectItem value="limousine" className="text-white hover:bg-zinc-800">Limousine</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Transmission */}
        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Transmission
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                  <Car className="text-zinc-400 h-4 w-4" />
                </div>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200">
                      <SelectValue placeholder="Select transmission type" className="text-zinc-500" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="automatic" className="text-white hover:bg-zinc-800">Automatic</SelectItem>
                      <SelectItem value="manual" className="text-white hover:bg-zinc-800">Manual</SelectItem>
                      <SelectItem value="semi_automatic" className="text-white hover:bg-zinc-800">Semi-Automatic</SelectItem>
                      <SelectItem value="cvt" className="text-white hover:bg-zinc-800">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Exterior Color */}
        <FormField
          control={form.control}
          name="ExteriorColor"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Exterior Color
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 border border-zinc-600"></div>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Black, White, Silver"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Interior Color */}
        <FormField
          control={form.control}
          name="InteriorColor"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Interior Color
              </FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 border border-zinc-600"></div>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Black, White, Beige"
                    className="pl-10 pr-4 h-12 bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Description - Full Width */}
      <div className="mt-8 pt-6 border-t border-zinc-800">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-white text-sm font-medium flex items-center h-5">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of your car including its condition, features, history, etc."
                  className="min-h-32 resize-none bg-zinc-950/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#3BE188]/20 focus:border-[#3BE188] transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-zinc-400 text-xs">
                Minimum 30 characters. A good description increases your chances of selling quickly.
              </FormDescription>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};