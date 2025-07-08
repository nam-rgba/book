import api from "./api";

export interface Data {
  id: number
  createdAt: number
  updatedAt: number
  isDeleted: boolean
  deletedAt: number
  code: string
  no: number
  kvId: string
  kvName: string
  kvCode: string
  needNegotiate: boolean
  isVariantProduct: boolean
  syncId: string
  type: string
  deliveryType: string
  brandName: string
  name: string
  nameEn: string
  unitPrice: number
  finalPrice: number
  importPrice: number
  minPrice: number
  maxPrice: number
  length: number
  width: number
  height: number
  weight: number
  taxPercent: number
  image: string
  imageBackup: string
  sold: number
  pending: number
  description: string
  totalStar: number
  refPoint: number
  totalRate: number
  totalLike: number
  totalView: number
  isHighlight: boolean
  isActive: boolean
  videoUrl: string
  mode: string
  lifeCycleDay: number
  isVisibleInApp: boolean
  isPromotion: boolean
  isFlashSale: boolean

}

const getDetail = async (id: number) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
}

export { getDetail };