const calSale = (unitPrice: number, finalPrice: number): string => {
  if (unitPrice <= 0 || finalPrice <= 0) {
    return "0%";
  }
  
  const sale = ((unitPrice - finalPrice) / unitPrice) * 100 + 10;
  return `${Math.round(sale)}%`;
}

export default calSale;