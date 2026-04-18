import { getCars } from './api.js';
import { calculateNPV } from './utils.js'; // ✅ เพิ่ม

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

  const npv = calculateNPV(currentCar, years, insurance, maintenance);

  document.getElementById("npv-result").innerText =
    "NPV: ฿" + Math.round(npv).toLocaleString();
}

// ===== REALTIME UPDATE =====
document.querySelectorAll("#years, #insurance, #maintenance")
  .forEach(input => {
    input.addEventListener("input", updateNPV);
  });

// ===== LOAD =====
loadCar();