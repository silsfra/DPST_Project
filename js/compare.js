import { getCars } from "./api.js";

const DEFAULT_IMAGE = "assets/car_paint.png";

let cars = [];
let activeTarget = null;

const selectedCars = {
  car1: null,
  car2: null,
};

const modal = document.getElementById("carModal");
const brandSelect = document.getElementById("modalBrand");
const modelSelect = document.getElementById("modalModel");
const confirmBtn = document.getElementById("confirmCarBtn");
const carButtons = document.querySelectorAll(".open-car-modal");

async function initComparePage() {
  try {
    cars = await getCars();
    renderBrands();
  } catch (error) {
    console.error("Cannot initialize compare page:", error);
  }
}

function getBrands() {
  return [...new Set(cars.map(car => car.brand).filter(Boolean))].sort();
}

function getCarName(car) {
  return `${car.model || ""} ${car.trim || ""}`.trim();
}

function formatMoney(value) {
  return "฿" + Number(value || 0).toLocaleString();
}

function renderBrands() {
  // 1. สร้างหัวข้อเริ่มต้นไว้ใน Array ก่อน
  const options = [`<option value="">Select brand...</option>`];

  // 2. ใช้ push เพื่อสะสมตัวเลือกเข้ามา
  getBrands().forEach(brand => {
    options.push(`<option value="${brand}">${brand}</option>`);
  });

  // 3. ยัดใส่ innerHTML ทีเดียวตอนท้าย
  brandSelect.innerHTML = options.join("");
}

function renderModels(brand) {
  const options = [`<option value="">Select model...</option>`];

  cars
    .filter(car => car.brand === brand)
    .forEach(car => {
      const carName = getCarName(car);
      options.push(`<option value="${car.ID}">${carName}</option>`);
    });

  modelSelect.innerHTML = options.join("");
}

function getSelectedCar() {
  const carId = modelSelect.value;
  return cars.find(car => String(car.ID) === String(carId)) || null;
}

function updateCarButton(target, car) {
  const button = document.querySelector(
    `.open-car-modal[data-target="${target}"]`
  );

  if (!button || !car) return;

  button.textContent = `${car.brand} ${getCarName(car)}`;
}

function updateCarImage(target, car) {
  console.log("Target:", target);
  console.log("Car:", car);
  console.log("Image URL:", car.image_url);

  const column = document.querySelector(
    `.compare-column[data-car="${target}"]`
  );

  const image = column?.querySelector(".car-frame img");

  console.log("Image Element:", image);

  image.src = car.image_url || DEFAULT_IMAGE;

  console.log("Final src:", image.src);
} 

function getDetailValue(car, key) {
  const values = {
    npv: "-",
    price: formatMoney(car.price),
    range: `${car.wltp_range_km || "-"} km`,
    battery: `${car.battery_capacity_kWh || "-"} kWh`,
    charging: `${car.dc_charging_power_kW || "-"} kW`,
    horsepower: `${car.horsepower_hp || "-"} hp`,
    torque: `${car.torque_Nm || "-"} Nm`,
  };

  return values[key] ?? "-";
}

function updateCarDetails(target, car) {
  const column = document.querySelector(
    `.compare-column[data-car="${target}"]`
  );

  if (!column || !car) return;

  column.querySelectorAll(".detail-row").forEach(row => {
    const key = row.dataset.key;
    const value = row.querySelector("strong");

    if (!value) return;

    value.textContent = getDetailValue(car, key);
  });
}

function updateCompareColumn(target, car) {
  selectedCars[target] = car;

  updateCarButton(target, car);
  updateCarImage(target, car);
  updateCarDetails(target, car);
}

carButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeTarget = button.dataset.target;

    brandSelect.value = "";
    modelSelect.innerHTML = `<option value="">Select model...</option>`;

    modal.classList.remove("hidden");
  });
});

brandSelect.addEventListener("change", () => {
  renderModels(brandSelect.value);
});

confirmBtn.addEventListener("click", () => {
  const selectedCar = getSelectedCar();

  if (!activeTarget || !selectedCar) return;

  updateCompareColumn(activeTarget, selectedCar);

  modal.classList.add("hidden");
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

initComparePage();