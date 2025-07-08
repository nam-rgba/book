

type ProductCardProps = {
    id: number;
    name: string;
    image: string;
    sold: string;
    price: string;
    }

const filterProducts = (rawData: unknown[]): ProductCardProps[] => {
  return rawData.map(item => {
    const product = item as { id: number; name: string; image: string; sold: string; unitPrice: string };
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      sold: product.sold,
      price: product.unitPrice,
    };
  });
}

export { filterProducts };
export type { ProductCardProps };