import Header from "../components/Header";
import { getDetail } from "../api/detail";
import type { Data } from "../api/detail";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Image, Alert } from "antd";
import { toVND } from "../utils/toVND";
import calSale from "../utils/calSale";
import Lorem from "../utils/lorem";
import { cartStore } from "../store/cart.mobx";
import { observer } from "mobx-react-lite";

const Home = observer(() => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const detail = await getDetail(parseInt(id || "0", 10));
        setData(detail.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const images = [data?.image, data?.image, data?.image, data?.image];

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col ">
      <Header />
      <div className="bg-white flex flex-row items-center justify-around py-8 px-20">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={images[selectedImage]}
            alt="Product"
            width={260}
            className=" object-cover mb-4 border-2 border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          />
          <div className="flex flex-row space-x-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 object-cover cursor-pointer border-2  rounded ${
                  selectedImage == index
                    ? "border-blue-500 "
                    : "border-gray-300 opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start w-105 h-full">
          <div className="text-left text-green-600 mb-2">
            <span className="text-sm font-semibold">Sách self help</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {data?.name}
          </h1>
          <div className="text-gray-600 mb-4 h-24  line-clamp-4 overflow-hidden text-ellipsis ">
            {data?.description} {Lorem}
          </div>
          <div className="flex flex-row items-center space-x-4 mb-2">
            <span className="text-2xl font-semibold text-green-600">
              {toVND(data?.finalPrice || 0)}
            </span>
            <span className="text-[14px] text-orange-500 bg-amber-200 p-0.5 font-bold rounded-lg">
              {calSale(data?.unitPrice || 0, data?.finalPrice || 0)}
            </span>
          </div>
          <div className="flex flex-row items-center space-x-4 mb-4">
            <span className="text-gray-500 text-sm line-through">
              {toVND(data?.unitPrice || 0)}{" "}
            </span>
          </div>
          <button
            onClick={() => {
              cartStore.addToCart({
                id: data?.id || 0,
                name: data?.name || "",
                imageUrl: data?.image || "",
                price: data?.finalPrice || 0,
                quantity: 1,
              });
              setAlert(true);
            }}
            className="bg-lime-500 text-white px-6 py-2  transition-colors shadow-lime-500 shadow-lg hover:bg-lime-600  focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {alert && (
        <Alert
          message="Thêm vào giỏ hàng thành công"
          type="success"
          showIcon
          closable
          onClose={() => setAlert(false)}
          className="fixed bottom-1 left-[72%] w-[400px] z-50 bg-white mt-10"
        />
      )}
    </div>
  );
});
export default Home;
