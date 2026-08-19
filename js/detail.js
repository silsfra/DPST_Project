import { getCars } from './api.js';

import {
  calculateNPV,
  calculateRunningCost,
  calculateResalePrice,
  getTax
} from './utils.js';

const DISCOUNT_RATE = 0.03;
const ACT = 645.21;

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let currentCar = null;

  const formatMoney = value =>
    Math.round(value).toLocaleString() + "฿";

  async function loadCar() {
    const cars = await getCars();
    const car = cars.find(c => String(c.id) === String(id));

    if (!car) {
      document.body.innerHTML = `<h1>Car Not Found</h1>`;
      return;
    }

    currentCar = car;

    const fullName = `${car.brand} ${car.model} ${car.trim || ""}`.trim();

    document.getElementById("car-image").src = car.image_url;
    document.getElementById("car-title").innerText = fullName;

    const insuranceInput =
      document.getElementById("insurance");

    if (insuranceInput) {
      insuranceInput.value =
        car.insurance ?? 25000;
    }

    const colors = car.colors || [];

    document.getElementById("car-colors").innerHTML =
      colors.map(color => {
        if (color.secondary) {
          return `
        <div
          class="detail-color-dot"
          title="${color.name}"
          style="
            background:
            linear-gradient(
              to bottom,
              ${color.secondary} 50%,
              ${color.hex} 50%
            );
          ">
        </div>
      `;
        }

        return `
      <div
        class="detail-color-dot"
        title="${color.name}"
        style="background: ${color.hex};">
      </div>
    `;
      }).join("");

    document.getElementById("car-spec-grid").innerHTML = `
      <div class="spec-card">
        <span>Range</span>
        <strong>${car.wltp_range_km || "-"} km</strong>
      </div>
    
      <div class="spec-card">
        <span>Battery</span>
        <strong>${car.battery_capacity_kWh || "-"} kWh</strong>
      </div>
    
      <div class="spec-card">
        <span>Charging</span>
        <strong>${car.dc_charging_power_kW || "-"} kW</strong>
      </div>
    
      <div class="spec-card">
        <span>Torque</span>
        <strong>${car.torque_Nm || "-"} Nm</strong>
      </div>
    
      <div class="spec-card">
        <span>Horse Power</span>
        <strong>${car.horsepower_hp || "-"} hp</strong>
      </div>
    
      <div class="spec-card">
        <span>0-100 km/h</span>
        <strong>${car.acceleration_0_100_sec || "-"} sec</strong>
      </div>
    `;

    updateNPV();
  }

  function getInputValue(id) {
    return Number(document.getElementById(id).value);
  }

  function getElectricityRate() {
    const selected = document.querySelector(
      'input[name="charging-type"]:checked'
    );
  
    return Number(selected?.dataset.rate || 0);
  }
  
  function calculateElectricityCostPerYear(km, electricityRate) {
    const battery = Number(currentCar.battery_capacity_kWh || 0);
    const range = Number(currentCar.wltp_range_km || 0);
  
    if (range <= 0) return 0;
  
    const kWhPerKm = battery / range;
  
    return km * kWhPerKm * electricityRate;
  }

  function calculateDiscountedRunningCost(
    years,
    insurance,
    maintenance,
    electricityCostPerYear
  ) {
    let total = 0;
    const taxBase = getTax(currentCar.weight);
  
    for (let year = 1; year <= years; year++) {
      const tax = year === 1 ? taxBase * 0.2 : taxBase;
  
      const yearlyCost =
        insurance +
        maintenance +
        ACT +
        tax +
        electricityCostPerYear;
  
      total += yearlyCost / Math.pow(1 + DISCOUNT_RATE, year);
    }
  
    return total;
  }

  function updateNPV() {
    if (!currentCar) return;
  
    const years = getInputValue("years");
    const insurance = getInputValue("insurance");
    const maintenance = getInputValue("maintenance");
    const km = getInputValue("km");
  
    // ราคาค่าไฟตามรูปแบบการชาร์จที่เลือก
    const electricityRate = getElectricityRate();
  
    // ค่าไฟต่อปี
    const electricityCostPerYear =
      calculateElectricityCostPerYear(
        km,
        electricityRate
      );
  
    // ค่าใช้จ่ายเดิมที่ระบบคำนวณ
    const baseRunningCost =
      calculateRunningCost(
        currentCar,
        years,
        insurance,
        maintenance
      );
  
    // รวมค่าไฟเข้าไป
    const runningCost =
      baseRunningCost +
      (electricityCostPerYear * years);
  
    // ราคาขายต่อ
    const resale =
      calculateResalePrice(
        currentCar,
        years,
        km
      );
  
    // ค่าใช้จ่ายทั้งหมดหลังคิดลด รวมค่าไฟ
    const discountedRunningCost =
      calculateDiscountedRunningCost(
        years,
        insurance,
        maintenance,
        electricityCostPerYear
      );
  
    // ราคาขายต่อหลังคิดลด
    const discountedResale =
      resale /
      Math.pow(1 + DISCOUNT_RATE, years);
  
    // NPV ใหม่ที่รวมค่าไฟแล้ว
    const npv =
      -Number(currentCar.price)
      - discountedRunningCost
      + discountedResale;
  
    document.getElementById(
      "running-cost-result-per-year"
    ).innerText =
      "ค่าใช้จ่ายเพิ่มเติมรายปี: " +
      formatMoney(runningCost / years);
  
    document.getElementById(
      "running-cost-result"
    ).innerText =
      "ค่าใช้จ่ายเพิ่มเติมตลอดระยะเวลา: " +
      formatMoney(runningCost);
  
    document.getElementById(
      "npv-result"
    ).innerText =
      "NPV: " + formatMoney(npv);
  
    document.getElementById("npv-summary").innerHTML = `
      <div class="npv-summary-row">
        <span>ราคารถเริ่มต้น</span>
        <strong>-${formatMoney(currentCar.price)}</strong>
      </div>
  
      <div class="npv-summary-row">
        <span>ค่าใช้จ่ายเพิ่มเติมหลังคิดลด 3.0%</span>
        <strong>-${formatMoney(discountedRunningCost)}</strong>
      </div>
  
      <div class="npv-summary-row">
        <span>มูลค่าปัจจุบันของราคาขายต่อ</span>
        <strong>+${formatMoney(discountedResale)}</strong>
      </div>
  
      <div class="npv-summary-row total">
        <span>สูตรที่ใช้</span>
        <strong>
          -${formatMoney(currentCar.price)}
          -${formatMoney(discountedRunningCost)}
          +${formatMoney(discountedResale)}
          =
          ${formatMoney(npv)}
        </strong>
      </div>
    `;
  }

  document
  .querySelectorAll("#years, #insurance, #maintenance, #km")
  .forEach(input => {
    input.addEventListener("input", updateNPV);
  });

document
  .querySelectorAll('input[name="charging-type"]')
  .forEach(input => {
    input.addEventListener("change", updateNPV);
  });

loadCar();
});