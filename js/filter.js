import { calculateNPV } from "./utils.js";

const NPV_YEARS = 5;
const NPV_INSURANCE = 25000;
const NPV_MAINTENANCE = 5000;
const NPV_KM_PER_YEAR = 15000;

function calculateDefaultNPV(car) {
  return calculateNPV(
    car,
    NPV_YEARS,
    NPV_INSURANCE,
    NPV_MAINTENANCE,
    NPV_KM_PER_YEAR
  ) || 0;
}

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function getBudgetValue(budget) {
  return Number(String(budget).replace(/[^0-9]/g, ""));
}

function matchBrand(car, brands) {
  if (!brands || brands.length === 0) return true;

  const carBrand = normalizeText(car.brand);
  const selectedBrands = brands.map(normalizeText);

  return selectedBrands.includes(carBrand);
}

function matchPriceRange(car, priceRange) {
  if (!priceRange) return true;

  const [minPrice, maxPrice] = priceRange.split("-").map(Number);

  return car.price >= minPrice && car.price <= maxPrice;
}

function matchCluster(car, cluster) {
  if (cluster === "") return true;

  return String(car.cluster) === String(cluster);
}

function matchBudget(car, budget) {
  if (!budget) return true;

  const budgetValue = getBudgetValue(budget);

  if (Number.isNaN(budgetValue) || budgetValue <= 0) return true;

  return car.price <= budgetValue;
}

function matchColor(car, colors) {
  if (!colors || colors.length === 0) return true;

  const carColors = car.color_groups || [];

  return colors.some(color => carColors.includes(color));
}

function sortCars(cars, sort) {
  const result = [...cars];

  const sorters = {
    asc: (a, b) => a.price - b.price,
    desc: (a, b) => b.price - a.price,
    "npv-asc": (a, b) => calculateDefaultNPV(a) - calculateDefaultNPV(b),
    "npv-desc": (a, b) => calculateDefaultNPV(b) - calculateDefaultNPV(a),
  };

  if (sorters[sort]) {
    result.sort(sorters[sort]);
  }

  return result;
}

export function applyFilters(cars, filters) {
  const filteredCars = cars.filter(car => {
    return (
      matchBrand(car, filters.brands) &&
      matchPriceRange(car, filters.priceRange) &&
      matchCluster(car, filters.cluster) &&
      matchBudget(car, filters.budget) &&
      matchColor(car, filters.colors)
    );
  });

  return sortCars(filteredCars, filters.sort);
}