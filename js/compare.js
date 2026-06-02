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
  brandSelect.innerHTML = `<option value="">Select brand...</option>`;

  getBrands().forEach(brand => {
    brandSelect.innerHTML += `
      <option value="${brand}">${brand}</option>
    `;
  });
}

function renderModels(brand) {
  modelSelect.innerHTML = `<option value="">Select model...</option>`;

  cars
    .filter(car => car.brand === brand)
    .forEach(car => {
      const carName = getCarName(car);

      modelSelect.innerHTML += `
        <option value="${car.ID}">
          ${carName}
        </option>
      `;
    });
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
  const column = document.querySelector(
    `.compare-column[data-car="${target}"]`
  );

  const image = column?.querySelector(".car-frame img");

  if (!image || !car) return;

  image.src = car.image_url || DEFAULT_IMAGE;
  image.alt = `${car.brand} ${getCarName(car)}`;
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