export function applyFilters(cars, filters) {
  return cars.filter(car => {

    // brand
    if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) {
      return false;
    }

    // price
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (car.price < min || car.price > max) {
        return false;
      }
    }

    return true;
  });
}