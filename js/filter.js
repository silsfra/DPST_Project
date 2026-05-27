import { calculateNPV } from "./utils.js";

const DEFAULT_YEARS = 5;
const DEFAULT_INSURANCE = 25000;
const DEFAULT_MAINTENANCE = 5000;
const DEFAULT_KM_PER_YEAR = 15000;

const PREFERENCE_CONFIG = {
  horsepower_hp: { direction: "high" },
  torque_Nm: { direction: "high" },
  acceleration_0_100_sec: { direction: "low" },
  cargo_capacity_liters: { direction: "high" },
  wltp_range_km: { direction: "high" },
  battery_capacity_kWh: { direction: "high" },
  dc_charging_power_kW: { direction: "high" },
  npv: { direction: "high" },
};

function calculateDefaultNPV(car) {
  return calculateNPV(
    car,
    DEFAULT_YEARS,
    DEFAULT_INSURANCE,
    DEFAULT_MAINTENANCE,
    DEFAULT_KM_PER_YEAR
  ) || 0;
}

function getPreferenceValue(car, key) {
  if (key === "npv") return calculateDefaultNPV(car);
  return Number(car[key] || 0);
}

function normalizeValue(value, min, max, direction) {
  if (max === min) return 1;

  const normalized = (value - min) / (max - min);

  return direction === "low" ? 1 - normalized : normalized;
}

function calculatePreferenceScore(car, cars, preferences) {
  if (!preferences || preferences.length === 0) return 0;

  const totalPercent = preferences.reduce(
    (sum, pref) => sum + pref.percent,
    0
  );

  if (totalPercent <= 0) return 0;

  let finalScore = 0;

  preferences.forEach(pref => {
    const config = PREFERENCE_CONFIG[pref.key];
    if (!config) return;

    const values = cars.map(c => getPreferenceValue(c, pref.key));
    const min = Math.min(...values);
    const max = Math.max(...values);

    const value = getPreferenceValue(car, pref.key);

    const normalizedScore = normalizeValue(
      value,
      min,
      max,
      config.direction
    );

    finalScore += normalizedScore * (pref.percent / totalPercent);
  });

  return finalScore;
}

function applyPreferenceScores(cars, preferences) {
  return [...cars]
    .map(car => ({
      ...car,
      match_score: calculatePreferenceScore(car, cars, preferences),
    }))
    .sort((a, b) => b.match_score - a.match_score);
}

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function getBudgetValue(budget) {
  return Number(String(budget).replace(/[^0-9]/g, ""));
}

function matchBrand(car, brands) {
  if (!brands || brands.length === 0) return true;

  return brands
    .map(normalizeText)
    .includes(normalizeText(car.brand));
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

function sortCars(cars, rankingMode) {
  const result = [...cars];

  const sorters = {
    default: () => 0,

    "price-asc": (a, b) => a.price - b.price,

    "price-desc": (a, b) => b.price - a.price,

    "npv-desc": (a, b) => calculateDefaultNPV(b) - calculateDefaultNPV(a),

    "npv-asc": (a, b) => calculateDefaultNPV(a) - calculateDefaultNPV(b),
  };

  if (sorters[rankingMode]) {
    result.sort(sorters[rankingMode]);
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

  if (filters.rankingMode === "personal") {
    return applyPreferenceScores(filteredCars, filters.preferences);
  }

  return sortCars(filteredCars, filters.rankingMode);
}

document.querySelectorAll(".custom-dropdown").forEach(dropdown => {

  const button = dropdown.querySelector(".dropdown-btn");

  button.addEventListener("click", () => {

    document.querySelectorAll(".custom-dropdown")
      .forEach(d => {
        if(d !== dropdown){
          d.classList.remove("open");
        }
      });

    dropdown.classList.toggle("open");
  });
});

document.addEventListener("click", (e) => {
  if(!e.target.closest(".custom-dropdown")){
    document.querySelectorAll(".custom-dropdown")
      .forEach(d => d.classList.remove("open"));
  }
});