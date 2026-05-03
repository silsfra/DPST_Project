import { calculateNPV } from "./utils.js";

export function applyFilters(cars, filters) {

  let result = cars.filter(car => {

    // ===== BRAND =====
    if (filters.brands.length > 0) {
      const carBrandLower = (car.brand || "").toLowerCase();
      const selectedBrandsLower = filters.brands.map(b => b.toLowerCase());

      if (!selectedBrandsLower.includes(carBrandLower)) {
        return false;
      }
    }

    // ===== PRICE RANGE =====
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split("-").map(Number);

      if (car.price < minPrice || car.price > maxPrice) {
        return false;
      }
    }

    // ===== CLUSTER =====
    if (filters.cluster !== "") {
      if (String(car.cluster) !== String(filters.cluster)) {
        return false;
      }
    }

    // ===== BUDGET =====
    if (filters.budget) {
      const budgetValue = Number(filters.budget.replace(/[^0-9]/g, ""));

      if (!isNaN(budgetValue) && budgetValue > 0) {
        if (car.price > budgetValue) {
          return false;
        }
      }
    }

    // ===== COLOR =====
    if (filters.colors && filters.colors.length > 0) {
      const carColors = car.color_groups || [];

      const match = filters.colors.some(selectedColor =>
        carColors.includes(selectedColor)
      );

      if (!match) {
        return false;
      }
    }

    return true;
  });

  // 🔥 ===== SORT ตรงนี้ =====
  if (filters.sort === "asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (filters.sort === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  if (filters.sort === "npv-desc") {
    result.sort((a, b) => {
      const npvA = calculateNPV(a, 5, 25000, 5000, 15000) || 0;
      const npvB = calculateNPV(b, 5, 25000, 5000, 15000) || 0;
      return npvB - npvA;
    });
  }

  // NPV น้อย → มาก
  if (filters.sort === "npv-asc") {
    result.sort((a, b) => {
      const npvA = calculateNPV(a, 5, 25000, 5000, 15000) || 0;
      const npvB = calculateNPV(b, 5, 25000, 5000, 15000) || 0;
      return npvA - npvB;
    });
  }

  return result;
}