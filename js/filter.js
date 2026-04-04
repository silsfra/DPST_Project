export function applyFilters(cars, filters) {
  return cars.filter(car => {

    // ✅ brand (fix case)
    if (filters.brands.length > 0) {
      const carBrand = car.brand.toLowerCase();

      const selectedBrands = filters.brands.map(b => b.toLowerCase());

      if (!selectedBrands.includes(carBrand)) {
        return false;
      }
    }

    // ✅ price
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);

      if (car.price < min || car.price > max) {
        return false;
      }
    }

    return true;
  });
}