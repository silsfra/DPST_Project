export function getTax(weight) {
  if (weight <= 500) return 150;
  if (weight <= 750) return 300;
  if (weight <= 1000) return 450;
  if (weight <= 1250) return 800;
  if (weight <= 1500) return 1000;
  if (weight <= 1750) return 1300;
  if (weight <= 2000) return 1600;
  if (weight <= 2500) return 1900;
  if (weight <= 3000) return 2200;
  if (weight <= 3500) return 2400;
  if (weight <= 4000) return 2600;
  if (weight <= 4500) return 2800;
  if (weight <= 5000) return 3000;
  if (weight <= 6000) return 3200;
  if (weight <= 7000) return 3400;
  return 3600;
}

export function calculateNPV(car) {
  const insurance = 25000;
  const maintenance = 5000;
  const act = 645.21;

  const taxBase = getTax(car.weight_kg);

  let npv = -car.price;

  for (let t = 1; t <= 5; t++) {

    // ปีแรกจ่าย 20%
    const tax = t === 1 ? taxBase * 0.2 : taxBase;

    const yearlyCost = insurance + maintenance + act + tax;

    const discounted = (-yearlyCost) / Math.pow(1.05, t);

    npv += discounted;
  }

  return npv;
}