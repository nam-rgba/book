import { useNavigate } from "react-router-dom";
import {toVND} from "../utils/toVND";


const Card = ({ id, name, image, sold, price }: {
    id: number;
    name: string;
    image: string;
    sold: string;
    price: string;
}) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => { navigate(`/detail/${id}`) }}
     className="w-[20%] h-[380px] lg:H-[400px] bg-white shadow-md rounded-lg cursor-pointer overflow-hidden border-t border-gray-200">
      <img src={image} alt={name} className="w-full p-4 h-2/3 object-cover" />
      <div className="p-4 ">
        <p className=" font-semibold truncate ">{name}</p>
        <p className="text-gray-600 text-[14px]">Đã bán {sold+10} quyển</p>
        {/* fake price */}
        <div> 
          <span className="text-gray-500 line-through text-sm">{toVND(1.1 * Number(price))}</span>
          <span className="text-green-500 ml-2 text-sm">-10%</span>
        </div>
        <p className="text-lg font-bold text-rose-500">{toVND(price)}</p>
      </div>
    </div>
  );
}

export default Card;