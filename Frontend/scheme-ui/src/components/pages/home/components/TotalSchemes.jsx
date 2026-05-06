import React, { useState, useEffect } from "react";
import { FileText, Building, Landmark, Search, ArrowRight } from "lucide-react";
import axios from "axios";


const StatCard = ({ icon: Icon, title, value }) => (

  <div className="bg-white p-5 md:p-7 rounded-2xl shadow-md flex items-center transition transform hover:scale-105 duration-300 min-h-[130px]">

    <Icon size={50} className="text-[#74B83E] mr-6 flex-shrink-0" />

    <div>

      <h3 className="text-xl md:text-3xl font-semibold">{value}</h3>

      <p className="text-neutral-600 text-base md:text-lg">{title}</p>

    </div>

  </div>

);



const TotalSchemes = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    central: 0,
    state: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        // Fetching all schemes to the frontend
        const res = await axios.get(`${BACKEND_URL}/api/v1/schemes/get-all-schemes`);
        console.log("Fetched schemes for stats:", res);
        if (res.data.success) {
          const allSchemes = res.data.totalSchemes;

          // Perform logic counting on the frontend
          setStats({
            total: allSchemes,
            central: res.data.centralCount,
            state: res.data.stateCount,
          });
        }
      } catch (err) {
        console.error("Failed to fetch schemes for counting", err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  return (

    <section className="px-4 md:px-8 py-10 md:pb-0.5 bg-gray-100 mt-8 ">

      <div className="container mx-auto flex flex-col gap-14">

        {/* Title */}

        <h1 className="text-3xl md:text-4xl font-bold text-center">

          Total Available Schemes

        </h1>



        {/* Cards Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">

          <StatCard

            icon={FileText}

            title="Total Schemes Available"

            value={stats.total}

          />

          <StatCard

            icon={Building}

            title="Total Central Schemes"

            value={stats.central}

          />

          <StatCard

            icon={Landmark}

            title="Total States Schemes "

            value={`${stats.state}`}

          />

        </div>



        {/* Button */}

        <div className="flex justify-center mb-14">

          <button className="bg-gradient-to-r from-[#74B83E] mb-10 to-[#5DA935] text-white px-12 md:px-20 py-6 md:py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-100 hover:brightness-110">

            <Search size={22} />

            Find Schemes for You

          </button>

        </div>

      </div>

    </section>

  );

};
export default TotalSchemes;