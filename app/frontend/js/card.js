function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function createTestDetails({ type, icon, count, dates }) {
    const testLiElement = document.createElement('li');
    testLiElement.classList.add(icon);

    const testDetailsElement = document.createElement('details');

    const testSummaryElement = document.createElement('summary');
    const numberOfTestOutput = document.createElement('span');
    numberOfTestOutput.textContent = count;

    testSummaryElement.appendChild(numberOfTestOutput);
    testSummaryElement.appendChild(document.createTextNode(` ${type.replace(/_/g, ' ')}${count > 1 ? 's' : ''}`));

    const testDetailsUlElement = document.createElement('ul');

    dates.map((date) => {
        const testDetailsLiElement = document.createElement('li');
        testDetailsLiElement.textContent = date;
        testDetailsUlElement.appendChild(testDetailsLiElement);
    });

    const newDateInputDiv = document.createElement('div');
    const newDateInput = document.createElement("input");
    newDateInput.type = 'date';
    newDateInputDiv.appendChild(newDateInput);


    const newDateButton = document.createElement('button');
    newDateButton.textContent = 'Add';
    newDateInputDiv.appendChild(newDateButton);
    newDateButton.addEventListener('click', (event) => {
        if (newDateInput.value !== '') {
            const testDetailsLiElement = document.createElement('li');
            testDetailsLiElement.textContent = formatDate(newDateInput.value);
            testDetailsUlElement.insertBefore(testDetailsLiElement, testDetailsUlElement.lastChild);
            newDateInput.value = '';
        }
    })
    const testDetailsLiElement = document.createElement('li');
    testDetailsLiElement.appendChild(newDateInputDiv);
    testDetailsUlElement.appendChild(testDetailsLiElement);

    testDetailsElement.appendChild(testDetailsUlElement);
    testDetailsElement.appendChild(testSummaryElement);

    testLiElement.appendChild(testDetailsElement);

    return testLiElement;
}

export function renderCard(vehicle, deleteVehicle) {
    const card = document.createElement('div');
    card.setAttribute('data-index', vehicle.id);
    card.setAttribute('tabindex', '0');

    card.classList.add('card');

    const vehicleNameWrapper = document.createElement('div');
    vehicleNameWrapper.classList.add('vehicle-name-wrapper');

    const vehicleNameElement = document.createElement('h2');
    vehicleNameElement.classList.add('vehicle-name');
    vehicleNameElement.textContent = vehicle.name;
    vehicleNameWrapper.appendChild(vehicleNameElement);

    const vehicleInfoContainer = document.createElement('div');
    vehicleInfoContainer.classList.add('vehicle-info-container');

    const vehicleTypeParagraph = document.createElement('p');
    vehicleTypeParagraph.textContent = 'Vehicle type: ';
    const vehicleTypeSpan = document.createElement('span');
    vehicleTypeSpan.classList.add('vehicle-type-output');
    vehicleTypeSpan.textContent = vehicle.type;
    vehicleTypeParagraph.appendChild(vehicleTypeSpan)
    vehicleInfoContainer.appendChild(vehicleTypeParagraph);

    const vehicleLocationContainer = document.createElement('div');
    vehicleLocationContainer.classList.add('vehicle-location-container');

    const paragraph = document.createElement('p');
    paragraph.textContent = 'Location: ';


    const locationSpan = document.createElement('span');
    locationSpan.classList.add('location-output');
    locationSpan.textContent = vehicle.location;

    paragraph.appendChild(locationSpan);

    const locationButton = document.createElement('button');
    locationButton.classList.add('location-button');
    locationButton.setAttribute('title', 'View location');
    locationButton.setAttribute('aria-label', 'view location');
    locationButton.addEventListener('click', () => window.open(vehicle.location_link, '_blank'))

    const mapIcon = document.createElement('img');
    mapIcon.src = 'assets/icons/map-icon.svg';
    mapIcon.alt = 'map icon';

    locationButton.appendChild(mapIcon);

    vehicleLocationContainer.appendChild(paragraph);
    vehicleLocationContainer.appendChild(locationButton);

   
   vehicleInfoContainer.appendChild(vehicleLocationContainer)
 /*
   const vehicleStatusPElement = document.createElement('p');
   vehicleStatusPElement.textContent = 'Status: ';
   const vehicleStatusOutput = document.createElement('span');
   vehicleStatusOutput.classList.add('vehicle-status-output');
   vehicleStatusOutput.textContent = vehicle.status.current;
   vehicleStatusPElement.appendChild(vehicleStatusOutput);

  
   const vehicleStatusDiv = document.createElement('div');
   vehicleStatusDiv.classList.add('vehicle-status');
   vehicleStatusDiv.appendChild(vehicleStatusPElement);
   vehicleInfoContainer.appendChild(vehicleStatusDiv);

   const testingListContainer = document.createElement('div');
   testingListContainer.classList.add('testing-list-container');
   const testingListContainerTitleElement = document.createElement('h3');
   testingListContainerTitleElement.textContent = 'Completed Testing:';
   testingListContainer.appendChild(testingListContainerTitleElement);

   const testingListUlElement = document.createElement('ul');

   vehicle.testing.completed.forEach(test => {
       const testLiElement = createTestDetails(test);
       testingListUlElement.appendChild(testLiElement);
   });

   testingListContainer.appendChild(testingListUlElement);
   vehicleInfoContainer.appendChild(testingListContainer);
*/
    card.appendChild(vehicleNameWrapper);
    vehicleNameWrapper.addEventListener('dblclick', () => {
          if (confirm(`Are you sure you want to remove ${vehicle.name}?`)) {
            deleteVehicle(vehicle.id);
            card.remove();
        }
    });
    card.appendChild(vehicleInfoContainer);
    return card;
}