import { getCars } from './api.js';
import { calculateNPV, calculateRunningCost } from './utils.js'; // ✅ เพิ่ม


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let currentCar = null;

async function loadCar() {
  const cars = await getCars();
  const car = cars.find(c => String(c.ID) === id);

  if (!car) return;

  currentCar = car;

  // ===== FULL NAME =====
  const fullName = `${car.brand} ${car.model} ${car.trim || ""}`.trim();

  // ===== RENDER =====
  document.getElementById("car-image").src = car.image_url;
  document.getElementById("car-title").innerText = fullName;

  // 👉 lorem แทนไปก่อน
  document.getElementById("car-desc").innerText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  updateNPV();
}

function updateNPV() {
  if (!currentCar) return;

  const years = Number(document.getElementById("years").value);
  const insurance = Number(document.getElementById("insurance").value);
  const maintenance = Number(document.getElementById("maintenance").value);
  const km = Number(document.getElementById("km").value);

  const npv = calculateNPV(currentCar, years, insurance, maintenance, km);
  const runningCost = calculateRunningCost(
    currentCar,
    years,
    insurance,
    maintenance
  );

  document.getElementById("npv-result").innerText =
    "NPV: " + Math.round(npv).toLocaleString() + "฿";

  document.getElementById("running-cost-result").innerText =
    "ค่าใช้จ่ายเพิ่มเติมตลอดระยะเวลา: " +
    Math.round(runningCost).toLocaleString() + "฿";

  document.getElementById("running-cost-result-per-year").innerText =
    "ค่าใช้จ่ายเพิ่มเติมรายปี: " +
    Math.round(runningCost / years).toLocaleString() + "฿";
}

// ===== REALTIME UPDATE =====
document.querySelectorAll("#years, #insurance, #maintenance, #km")
  .forEach(input => {
    input.addEventListener("input", updateNPV);
  });

// ===== LOAD =====
loadCar();