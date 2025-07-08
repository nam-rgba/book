import { useEffect, useState } from "react";
import axios from "axios";

import { filterProducts } from "../utils/filtTypeProduct";
import type { ProductCardProps } from "../utils/filtTypeProduct";
import {toVND} from "../utils/toVND";

import Card from "./Card";

const API_URL = "https://shop.staging.bmdapp.store:3249/v1/customer/product";

const Outstanding = () => {
    
    const [data, setData] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    const fetchOutstandingProducts = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            page: 1,
            limit: 8,
          },
          headers: {
            "namespace": "hoangphuc",
          },
        });
        const filteredProducts = filterProducts(response.data.data.products);
        console.log("Outstanding products:", filteredProducts);
        setData(filteredProducts);
      } catch (error) {
        console.error("Error fetching outstanding products:", error);
      }
    };

    fetchOutstandingProducts();
  }, []);

  return (
    <div className="w-full bg-white pt-6">
      <div className="w-full text-6xl text-center font-bold text-[#5A6A85] pt-10 my-8 border-b-2 border-[#BDC7D5] leading-[0.1em]">
        <span className="bg-white px-4 font-sans">SẢN PHẨM NỔI BẬT</span>
      </div>
        <div className="w-full flex flex-wrap justify-center gap-6 p-6">
            {data.map((product) => (
                <Card
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    sold={product.sold}
                    price={toVND(product.price)}
                />
            ))}
        </div>
    </div>
  );
};

export default Outstanding;
