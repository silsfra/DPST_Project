import { supabase } from './supabase.js';
import { calculateNPV, getTax } from './utils.js';

async function loadCar() {
  const id = new URLSearchParams(window.location.search).get("id");

  const { data, error } = await supabase
    .from("car_data")
    .select("*")
    .eq("ID", id)
    .single();

  const container = document.getElementById("car-detail");

  if (error || !data) {
    container.innerHTML = "❌ Car not found";
    return;
  }

  // 🔧 ค่า fixed
  const insurance = 25000;
  const maintenance = 5000;
  const act = 645.21;

  const taxBase = getTax(data.weight_kg);

  let breakdown = "";
  let npv = -data.price;

  // 🔥 LOOP 5 ปี
  for (let t = 1; t <= 5; t++) {
    const tax = t === 1 ? taxBase * 0.2 : taxBase;

    const yearlyCost = insurance + maintenance + act + tax;

    const discounted = (-yearlyCost) / Math.pow(1.05, t);

    npv += discounted;

    breakdown += `
      <p>
        ปี ${t}: (-${yearlyCost.toLocaleString()}) / (1.05^${t}) 
        = ${discounted.toLocaleString()}
      </p>
    `;
  }

  // 🔥 render
  container.innerHTML = `
    <h2>${data.brand} ${data.model} ${data.trim || ""}</h2>

    <p>💰 Price: ${data.price.toLocaleString()} บาท</p>
    <p>🔋 Range: ${data.wltp_range_km} km</p>
    <p>🔋 Battery: ${data.battery_capacity_kWh || "-"} kWh</p>
    <p>⚡ Torque: ${data.torque_Nm || "-"} Nm</p>
    <p>🏎️ Horsepower: ${data.horsepower_hp || "-"} hp</p>
    <p>🧳 Cargo: ${data.cargo_capacity_liters || "-"} L</p>

    <hr>

    <h3>📊 NPV Calculation (5 Years)</h3>

    <p>NPV = -${data.price.toLocaleString()}</p>

    ${breakdown}

    <p style="color:green; font-weight:bold;">
      NPV = ${npv.toLocaleString()} บาท
    </p>
  `;
}

loadCar();