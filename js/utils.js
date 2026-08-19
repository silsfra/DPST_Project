const ACT_FEE = 645.21;
const DISCOUNT_RATE = 0.03;

const RESALE_INITIAL_DROP = 0.2293;
const RESALE_AGE_RATE = 0.061;
const RESALE_MILEAGE_RATE = 0.052;

const TAX_TABLE = [
  [500, 150],
  [750, 300],
  [1000, 450],
  [1250, 800],
  [1500, 1000],
  [1750, 1300],
  [2000, 1600],
  [2500, 1900],
  [3000, 2200],
  [3500, 2400],
  [4000, 2600],
  [4500, 2800],
  [5000, 3000],
  [6000, 3200],
  [7000, 3400],
];

function getCarWeight(car) {
  return car.weight_kg ?? car.weight ?? 0;
}

function getYearlyTax(taxBase, year) {
  return year === 1 ? taxBase * 0.2 : taxBase;
}

function getDiscountFactor(year) {
  return Math.pow(1 + DISCOUNT_RATE, year);
}

export function getTax(weight) {
  const row = TAX_TABLE.find(([maxWeight]) => weight <= maxWeight);
  return row ? row[1] : 3600;
}

export function calculateResalePrice(car, years, kmPerYear) {
  const totalDistance = kmPerYear * years;

  const priceAfterInitialDrop =
    car.price * (1 - RESALE_INITIAL_DROP);

  const ageFactor =
    Math.pow(1 - RESALE_AGE_RATE, years);

  const mileageFactor =
    Math.pow(1 - RESALE_MILEAGE_RATE, totalDistance / 10000);

  return priceAfterInitialDrop * ageFactor * mileageFactor;
}

export function calculateElectricityCost(car, kmPerYear, electricityRate) {
  const battery = Number(car.battery_capacity_kWh || 0);
  const range = Number(car.wltp_range_km || 0);

  if (range <= 0 || !electricityRate) return 0;

  const kWhPerKm = battery / range;

  return kmPerYear * kWhPerKm * electricityRate;
} 

export function calculateRunningCost(
  car,
  years,
  insurance,
  maintenance,
  kmPerYear,
  electricityRate
) {
  const taxBase = getTax(getCarWeight(car));

  const electricityCost =
    calculateElectricityCost(
      car,
      kmPerYear,
      electricityRate
    );

  let total = 0;

  for (let year = 1; year <= years; year++) {
    const tax = getYearlyTax(taxBase, year);

    total +=
      insurance +
      maintenance +
      ACT_FEE +
      tax +
      electricityCost;
  }

  return total;
}

export function calculateNPV(
  car,
  years,
  insurance,
  maintenance,
  kmPerYear,
  electricityRate
) {
  const taxBase = getTax(getCarWeight(car));

  const electricityCost =
    calculateElectricityCost(
      car,
      kmPerYear,
      electricityRate
    );

  let npv = -car.price;

  for (let year = 1; year <= years; year++) {
    const tax = getYearlyTax(taxBase, year);

    const yearlyCost =
      insurance +
      maintenance +
      ACT_FEE +
      tax +
      electricityCost;

    npv -= yearlyCost / getDiscountFactor(year);

    if (year === years) {
      const resale =
        calculateResalePrice(
          car,
          years,
          kmPerYear
        );

      npv +=
        resale /
        getDiscountFactor(year);
    }
  }

  return npv;
}

export function normalize(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}