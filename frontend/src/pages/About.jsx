// <!-- AboutUs.jsx -->
import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-slate-100">
            About <span className="text-emerald-600">Grocify</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            Bringing fresh, organic, and locally-sourced groceries right to your doorstep.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e"
              alt="Fresh grocery basket from ShopEase"
              className="rounded-3xl shadow-xl w-full object-cover h-[450px]"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-slate-100 mb-4">
              Who We Are
            </h2>

            <p className="text-gray-600 dark:text-slate-400 leading-7 mb-6">
              Grocify is your trusted neighborhood digital market. We bypass long supermarket lines 
              and middle-men to deliver crisp vegetables, juicy fruits, pantry staples, and premium 
              dairy straight from farm to table. 
            </p>

            <p className="text-gray-600 dark:text-slate-400 leading-7 mb-6">
              We partner with local farmers and artisan producers who share our commitment to 
              sustainable agriculture and uncompromised food quality.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md text-center">
                <h3 className="text-3xl font-bold text-emerald-600">100%</h3>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Organic & Fresh</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md text-center">
                <h3 className="text-3xl font-bold text-emerald-600">50+</h3>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Local Farm Partners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-20 bg-emerald-600 text-white rounded-3xl p-10 text-center shadow-lg">
          <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
          <p className="max-w-3xl mx-auto text-lg leading-8">
            To make healthy eating convenient and affordable for every household, while supporting 
            local agricultural ecosystems and minimizing food waste.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;