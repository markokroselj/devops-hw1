import { API_BASE_URL } from "./api.js";
import { vehicles as initialData } from "./data.js";

const vehicleTypeSelector = document.getElementById('type');

const typesRes = await fetch(`${API_BASE_URL}get-types`);
const typesData = await typesRes.json();

typesData.forEach((t) => {
    const option = document.createElement('option');
    option.value = t.id;
    option.text = t.type;
    vehicleTypeSelector.appendChild(option)
})

const locationsSelector = document.getElementById('locations');

const locationsRes = await fetch(`${API_BASE_URL}get-locations`);
const locationsData = await locationsRes.json();

locationsData.forEach((l) => {
    const option = document.createElement('option');
    option.value = l.id;
    option.text = l.location;
    locationsSelector.appendChild(option)
})

let vehicles = initialData;

if (localStorage.getItem('data')) {
    vehicles = JSON.parse(localStorage.getItem('data'));
}

const addVehicleForm = document.getElementById('add-vehicle-form');

addVehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const type = vehicleTypeSelector.value;
    const location = locationsSelector.value;

    const response = await fetch(`${API_BASE_URL}add-vehicle`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            type_id: type,
            location_id: location
        })
    })

    if (!response.ok) {
        const data = await response.json();
        alert(data.error);
        return;
    }

    window.location.href = 'index.html';
});

