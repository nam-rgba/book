import { useEffect, useState } from "react";
import { getAllProductsByCategory } from "../api/products";
import Header from "../components/Header";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Card from "../components/Card";
import { filterProducts } from "../utils/filtTypeProduct";
import type { ProductCardProps } from "../utils/filtTypeProduct";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "104", label: "Sách giáo khoa" },
  { key: "116", label: "Sách kinh điển" },
  { key: "114", label: "Sách yêu thích" },
  { key: "99", label: "Sách Hay" },
  { key: "sale", label: "On Sale" },
  { key: "best", label: "Best Seller" },
  { key: "new", label: "New Arrival" },
];

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<number>(104);
  const [products, setProducts] = useState<ProductCardProps[]>([]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsByCategory(selectedKeys);
        console.log(data);
        const filteredProducts = filterProducts(data.data.products);
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedKeys]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white">
        <span className="text-lg text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div>
        {/* menu side bar */}
        <div className="fixed left-0 top-40 h-full w-64  text-white">
          <Button
            type="primary"
            onClick={toggleCollapsed}
            className="absolute top-0 right-2 z-10"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Menu
            defaultSelectedKeys={["104"]}
            defaultOpenKeys={["sub1"]}
            inlineCollapsed={collapsed}
            items={items}
            onClick={(e) => {
              setSelectedKeys(parseInt(e.key, 10));
              console.log(selectedKeys);
            }}
            selectedKeys={[selectedKeys.toString()]}
          />
        </div>

        {/* content */}
        <div className="ml-64 p-8">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <div className="flex flex-wrap gap-6 ">
            {products.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                sold={product.sold}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
