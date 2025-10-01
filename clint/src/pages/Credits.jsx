import React, { useEffect, useState } from "react";
import { use } from "react";
import { dummyPlans } from "../assets/assets";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };
  useEffect(() => {
    fetchPlans();
  }, []);
  if (loading) return <loading />;
return (
  <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
      Credit Plans
    </h2>
    <div className="flex flex-wrap justify-center gap-10">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className={`relative border border-gray-200 dark:border-purple-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 min-w-[320px] flex flex-col items-start transform hover:-translate-y-2 ${
            plan._id === "pro"
              ? "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800"
              : "bg-white dark:bg-gray-900"
          }`}
        >
          {/* Pro Tag */}
          {plan._id === "pro" && (
            <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Popular
            </span>
          )}

          <div className="flex-1 w-full">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {plan.name}
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-300 mb-6">
              ${plan.price}
              <span className="text-base font-medium text-gray-600 dark:text-purple-200">
                {" "}/ {plan.credits} Credits
              </span>
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-purple-200">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Button */}
          <button className="mt-8 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
            Buy Now
          </button>
        </div>
      ))}
    </div>
  </div>
);

};

export default Credits;
