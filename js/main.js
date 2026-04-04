import { supabase } from './supabase.js';

async function fetchCars() {

    const checkedBrands = Array.from(document.querySelectorAll(".brand:checked"))
        .map(cb => cb.value);

    let query = supabase
        .from("car_data")
        .select("*");

    // 👉 filter ถ้ามีการเลือก
    if (checkedBrands.length > 0) {
        query = query.in("brand", checkedBrands);
    }

    const { data, error } = await query;

    const container = document.getElementById("car-list");
    container.innerHTML = "";

    if (error) {
        container.innerHTML = "❌ Error loading data";
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "❌ No cars found";
        return;
    }

    data.forEach(car => {
        const div = document.createElement("div");
        div.className = "car-card";

        const npv = car.price + 30000;

        div.innerHTML = `
  <img src="assets/car_paint.png" class="car-image">

  <h3>${car.brand} ${car.model}</h3>
  <p>💰 ${car.price.toLocaleString()} บาท</p>
  <p>🔋 ${car.wltp_range_km} km</p>
  <p style="color:green;">NPV: ${npv.toLocaleString()}</p>
`;

        div.onclick = () => {
            window.location.href = `car.html?id=${car.ID}`;
        };

        container.appendChild(div);
    });
}


// 🔥 STEP 3: ใส่ตรงนี้ (ล่างสุดของไฟล์)
document.querySelectorAll(".brand").forEach(cb => {
    cb.addEventListener("change", fetchCars);
});


// 🔥 STEP 4: ใส่บรรทัดสุดท้ายเลย
fetchCars();