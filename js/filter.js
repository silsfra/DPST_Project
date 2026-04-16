export function applyFilters(cars, filters) {
  return cars.filter(car => {

    // ===== BRAND =====
    if (filters.brands.length > 0) {
      const carBrand = car.brand.toLowerCase();
      const selectedBrands = filters.brands.map(b => b.toLowerCase());

      if (!selectedBrands.includes(carBrand)) {
        return false;
      }
    }

    // ===== PRICE RANGE =====
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);

      if (car.price < min || car.price > max) {
        return false;
      }
    }

    // ===== CLUSTER =====
    if (filters.cluster !== "") {
      if (car.cluster != filters.cluster) {
        return false;
      }
    }

    // ===== BUDGET =====
    if (filters.budget) {
      const budget = Number(filters.budget.replace(/[^0-9]/g, ""));

      // กันเคส user พิมพ์มั่ว
      if (!isNaN(budget) && budget > 0) {
        if (car.price > budget) {
          return false;
        }
      }
    }

    return true;
  });
}