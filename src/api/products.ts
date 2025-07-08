import api from "./api";


const getAllProductsByCategory = async (idCategory: number) => {
  try {
    const response = await api.get(`/product`,
        {
            params: {
                productCategoryId: idCategory,
                page: 1,
                limit: 4
            }
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export { getAllProductsByCategory };