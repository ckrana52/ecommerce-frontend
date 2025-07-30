import React from 'react';
import { Truck, Shield, Users, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Logo and Trustpilot Section */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="mb-6 flex justify-center sm:justify-start w-full">
              <img src={process.env.PUBLIC_URL + '/petpnglogo.png'} alt="Pet Hub BD Logo" className="h-40 w-40 object-contain" />
            </div>
            {/* Trustpilot Style Rating */}
            <div className="w-full flex flex-col items-center sm:items-start">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Trustpilot</h3>
              <div className="flex items-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-green-500 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center sm:text-left">
                <span className="font-semibold">Trustscore 4.0</span> | 9,200 reviews
              </p>
            </div>
          </div>
          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Reviews</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Privacy policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Cookie policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Terms & conditions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Acceptable use policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Sitemap</a></li>
            </ul>
          </div>
          {/* Pet Care Services Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pet care services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Adopt a pet</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Track a pet order</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Home delivery</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Veterinary services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Pet grooming</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Pet training</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Emergency care</a></li>
            </ul>
          </div>
          {/* Customers Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Log in</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Register</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Contact us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Support hub</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300">Preferences</a></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">PET CARE TO</h4>
                <p className="font-bold text-purple-800">OVER 200 LOCATIONS</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">100% SECURE</h4>
                <p className="font-bold text-purple-800">CHECKOUT</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">OUTSTANDING</h4>
                <p className="font-bold text-purple-800">CUSTOMER SUPPORT</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">OVER 9,000</h4>
                <p className="font-bold text-purple-800">GENUINE REVIEWS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Methods Image Row */}
      <div className="w-full flex justify-center items-center py-4 bg-white border-t border-gray-200">
        <img src={process.env.PUBLIC_URL + '/payment-footer.png'} alt="Payment Methods" className="max-w-full h-auto" style={{minWidth: 300, maxHeight: 48}} />
      </div>
      {/* Bottom Bar - Only copyright and developer credit, centered */}
      <div className="w-full text-center py-4 border-t border-gray-200 bg-gray-200 text-gray-500 text-sm font-medium">
        Copyright © 2009-2024 | All Rights Reserved Developed by <span className="font-bold text-gray-700">RANA AHMED</span>
      </div>
    </footer>
  );
};

export default Footer; 