"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { Car, User, Mail, Lock,Eye,EyeOff } from "lucide-react"
import { signupSchema } from "@/utils/validations/signupvalidator"
import { useState } from "react"

export function CarAuctionSignup() {
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
      return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-8">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Car className="h-10 w-10 text-green-400 mb-4" />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-gray-400 mt-1">Join our exclusive car auction platform</p>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
              agreeToTerms: false,
            }}
            validationSchema={signupSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log("Submitting...");  
              console.log("Form submitted:", values)
              setSubmitting(false)
            }}
          >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      className="pl-10 bg-gray-900 border-gray-800"
                    />
                  </div>
                  <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 bg-gray-900 border-gray-800"
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : "password"}
                      placeholder="••••••"
                      className="pl-10 bg-gray-900 border-gray-800"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••"
                      className="pl-10 bg-gray-900 border-gray-800"
                    />
                     <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={values.agreeToTerms}
                    onCheckedChange={(checked) => setFieldValue("agreeToTerms", checked)}
                    className="border-gray-600"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-green-400 hover:underline">
                      terms of service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-green-400 hover:underline">
                      privacy policy
                    </a>
                  </label>
                </div>
                <ErrorMessage name="agreeToTerms" component="p" className="text-red-500 text-sm" />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-400 hover:bg-green-500 text-black"
                >
                  {isSubmitting ? "Creating..." : "Create account"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right side - Image and text */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
        <img
          src="/car-signup-page.jpg"
          alt="Luxury cars"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12 z-20">
          <h2 className="text-4xl font-bold mb-4">Join the Exclusive Auction</h2>
          <p className="text-lg">Create an account to bid on luxury and performance cars from around the world.</p>
        </div>
      </div>
    </div>
  )
}
