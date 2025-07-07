import { useEffect } from "react";
import axios from "axios";

const API_URL = "https://shop.staging.bmdapp.store:3249/v1/customer/product";

const Outstanding = () => {
  useEffect(() => {
    const fetchOutstandingProducts = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            page: 1,
            limit: 10,
            order: "desc",
          },
          headers: {
            "namespace": "hoangphuc",
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching outstanding products:", error);
      }
    };

    fetchOutstandingProducts();
  });

  return (
    <div className="w-full bg-white pt-6">
      <div className="w-full text-6xl text-center font-bold text-[#5A6A85] pt-10 border-b-2 border-[#BDC7D5] leading-[0.1em]">
        <span className="bg-white px-4 font-sans">SẢN PHẨM NỔI BẬT</span>
      </div>
    </div>
  );
};

export default Outstanding;
