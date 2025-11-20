import { renderCard } from "./card.js";
import { API_BASE_URL } from "./api.js";

const cardsContainer = document.getElementById('vehicle-cards-wrapper');
const vehicleTypeFilter = document.getElementById('vehicle-type-filter');
const removeAllBtn = document.getElementById('removeAll');
const searchInput = document.getElementById('search-input');
const nameFilter = document.getElementById('name-filter');
const locationFilter = document.getElementById('location-filter');


const response = await fetch(`${API_BASE_URL}get-vehicles`);
const data = await response.json();

let vehicles = data;

if (vehicles.length > 0) removeAllBtn.disabled = false;


function renderAllCards() {
    removeAllCards();
    vehicles.forEach(vehicle => cardsContainer.appendChild(renderCard(vehicle, deleteVehicle)));
}

function renderCards() {
    if (vehicleTypeFilter.value === 'all') renderAllCards();
    else filterCardsByType(vehicleTypeFilter.value);
}

function removeAllCards() {
    document.querySelectorAll('.card').forEach(card => cardsContainer.removeChild(card));
}

function filterCardsByType(type) {
    removeAllCards();
    vehicles.filter(vehicle => vehicle.type === type).forEach(vehicle =>
        cardsContainer.appendChild(renderCard(vehicle)));
}

function searchCards(searchQuerry) {
    removeAllCards();
    vehicles.filter(vehicle =>
    (
        (vehicleTypeFilter.value === 'all' || (vehicleTypeFilter.value === 'ship' && vehicle.type === 'ship')
            || (vehicleTypeFilter.value === 'booster' && vehicle.type === 'booster')) &&
        (
            (nameFilter.checked && vehicle.name.toLowerCase().includes(searchQuerry)) ||
            (locationFilter.checked && vehicle.location.toLowerCase().includes(searchQuerry))
        )

    )).forEach(vehicle =>
        cardsContainer.appendChild(renderCard(vehicle)));
}

renderCards();


vehicleTypeFilter.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'all':
            renderAllCards();
            break;
        case 'ship':
            filterCardsByType('Ship');
            break;
        case 'booster':
            filterCardsByType('Booster');
            break;
    }
})

removeAllBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to remove all the vehicles from the system,\nthis action cannot be undone?')) {
        const response = await fetch(`${API_BASE_URL}delete-all-vehicles`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            console.log(response.status)
            return;
        }
        removeAllCards();
        removeAllBtn.disabled = true;
        vehicles = [];
    }
})


searchInput.addEventListener('input', (event) => {
    const searchQuerry = event.target.value.toLowerCase();

    if (event.target.value === '') {
        renderCards();
    } else {
        searchCards(searchQuerry);
    }
});

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === 'k' || event.keyCode === 75)) {
        searchInput.focus();
        event.preventDefault();
    }
    if (event.key === 'Escape' || event.keyCode === 27) {
        if (document.activeElement === searchInput) renderCards();
        searchInput.blur()
    }
});



document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('card')) {
            if (confirm(`Are you sure you want to remove ${focusedElement.querySelector('h2').textContent}?`)) {
                deleteVehicle(focusedElement.dataset.index);
                focusedElement.remove();
            }
        }
    }
});

async function deleteVehicle(id) {
    const response = await fetch(`${API_BASE_URL}delete-vehicle/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        console.log(response.status)
        return;
    }

    vehicles = vehicles.filter(item => item.id !== id)
}