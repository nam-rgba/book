import Header from "../components/Header";
import { getDetail } from "../api/detail";
import type { Data } from "../api/detail";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "antd";
import { toVND } from "../utils/toVND";
import calSale from "../utils/calSale";
import Lorem from "../utils/lorem";
import { cartStore } from "../store/cart.mobx";
import { observer } from "mobx-react-lite";
import ImageMagnifier from "../components/ImageManifier";

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
      <div className="bg-white flex flex-col lg:flex-row items-start justify-center gap-8 py-8 px-4 lg:px-20 max-w-7xl mx-auto">
        {/* Product Images Section */}
        <div className="flex flex-col items-center justify-center lg:w-1/2">
          <div className="relative mb-6">
            <ImageMagnifier
              src={images[selectedImage]}
              width={350}
              height={500}
              zoom={2.5}
              size={150}
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex flex-row space-x-3">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 object-cover cursor-pointer border-2 rounded-lg transition-all duration-200 ${
                  selectedImage === index
                    ? "border-java-500 opacity-100 shadow-md"
                    : "border-gray-300 opacity-60 hover:opacity-80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col items-start lg:w-1/2 space-y-4">
          {/* Category */}
          <div className="bg-orange-100 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-orange-600">Sách self help</span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
            {data?.name}
          </h1>

          {/* Description */}
          <div className="text-gray-600 text-base leading-relaxed max-h-32 overflow-hidden">
            <p className="line-clamp-4">
              {data?.description} {Lorem}
            </p>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-4">
              <span className="text-3xl font-bold text-orange-500">
                {toVND(data?.finalPrice || 0)}
              </span>
              <span className="text-sm text-java-500 bg-java-200 px-2 py-1 font-bold rounded-lg">
                {calSale(data?.unitPrice || 0, data?.finalPrice || 0)}
              </span>
            </div>
            <div className="flex flex-row items-center">
              <span className="text-gray-500 text-lg line-through">
                {toVND(1.1*Number(data?.finalPrice) || 0)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-4">
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
              className="bg-java-500 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:bg-java-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-java-300 transform hover:-translate-y-1"
            >
              Add to Cart
            </button>
          </div>

          {/* Additional Product Info */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">📦</span>
              Miễn phí giao hàng hóa đơn từ 500,000₫
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">🔄</span>
              Không có chính sách hoàn trả
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-2">⚡</span>
              Giao hàng nội thành trong ngày
            </div>
          </div>
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
