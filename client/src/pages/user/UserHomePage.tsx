import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer';
import FeaturedCar from '@/components/cars/featuredCars';
import { Button } from '@/components/ui/button';

export default function UserHomePage() {

  return (
    <>
      <Header/>
      <FeaturedCar />
      <section className="py-16 px-6 bg-black">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-white">Why Choose Auto Auction</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-zinc-800 p-8 rounded-lg">
                <div className="bg-[#3BE188]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3BE188] text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4  text-white">Enthusiast Focus</h3>
                <p className="text-gray-200">
                  We specialize in enthusiast vehicles that are engaging to drive and own.
                </p>
              </div>
              
              <div className="bg-zinc-800 p-8 rounded-lg">
                <div className="bg-[#3BE188]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3BE188] text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4  text-white">Curated Selection</h3>
                <p className="text-gray-200">
                  Every vehicle is carefully reviewed and selected by our team of experts.
                </p>
              </div>
              
              <div className="bg-zinc-800 p-8 rounded-lg">
                <div className="bg-[#3BE188]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3BE188] text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4  text-white">Community Driven</h3>
                <p className="text-gray-200">
                  Join a passionate community of car enthusiasts who share your passion.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-zinc-900 to-black">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Have a special car to sell?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              List your vehicle on Auto Auction and reach thousands of passionate car enthusiasts.
            </p>
            <Button 
              className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-8 py-6 text-lg rounded-full"
            >
              Start Selling Today
            </Button>
          </div>
        </section>
      <Footer />
    </>

  )
}
