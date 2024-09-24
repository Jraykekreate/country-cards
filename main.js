const searchBar = document.querySelector(".search-input")
const cardsContainer = document.querySelector(".country-cards-container")
const countryContainer = document.querySelector('.actual-country-details')
const filterOptions = document.querySelector('.filter-options');
const backButton = document.querySelector('.back-button')

let watchedCard = '';
async function fetchData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json(); // Parse the JSON data from the response
    console.log(data)
    // Shuffle the data
    const shuffledData = shuffleArray(data);

    return shuffledData; // Return the shuffled data
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null; // Optionally return null in case of error
  }
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function formatNumberWithCommas(number) {
  // Convert the number to a string
  let numStr = number.toString();

  // Split the string into integer and decimal parts (if any)
  let parts = numStr.split('.');
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // Add commas to the integer part
  let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Combine the formatted integer part with the decimal part (if any)
  return formattedInteger + decimalPart;
}
function createCountryContainer(countryData) {
  const container = document.createElement('div');
  container.classList.add('country-container');

  // Button container
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const backButton = document.createElement('button');
  backButton.classList.add('back-button');
  backButton.textContent = 'Back';
  backButton.addEventListener('click',()=>{
    countryContainer.innerHTML =``
  countryContainer.classList.toggle('hide')
  cardsContainer.classList.toggle('hide')
  
  
  
  })
  // Append the button to the button container
  buttonContainer.appendChild(backButton);

  // Append the button container to the main container
  container.appendChild(buttonContainer);

  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('country-image-container');
  const image = document.createElement('img');
  console.log(countryData);
  image.src = countryData.flag;
  image.alt = `Image of ${countryData.name}`;
  image.classList.add('country-image', 'image-container');
  imageContainer.appendChild(image);

  // Country details
  const detailsText = document.createElement('div');
  detailsText.classList.add('country-details-text');

  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = countryData.name;
  detailsText.appendChild(title);

  // Actual details section
  const actualDetails = document.createElement('div');
  actualDetails.classList.add('actual-details');

  // First set of details (non-array)
  const detailTable1 = document.createElement('div');
  detailTable1.classList.add('detail-table');
  detailTable1.innerHTML = `
    <h4 class="detail">Population: <span class="detail-info">${formatNumberWithCommas(+countryData.population)}</span></h4>
    <h4 class="detail">Region: <span class="detail-info">${countryData.region}</span></h4>
    <h4 class="detail">Capital: <span class="detail-info">${countryData.capital}</span></h4>
    <h4 class="detail">Subregion: <span class="detail-info">${countryData.subregion}</span></h4>
  `;
  actualDetails.appendChild(detailTable1);

  // Second set of details
  const detailTable2 = document.createElement('div');
  detailTable2.classList.add('detail-table');
  detailTable2.innerHTML = `
    <h4 class="detail">Language: <span class="detail-info">${countryData.languages[0]?.iso639_2 || 'N/A'}</span></h4>
    <h4 class="detail">Currency: <span class="detail-info">${countryData.currencies[0]?.name || 'N/A'}</span></h4>
    <h4 class="detail">Timezone: <span class="detail-info">${countryData.timezones[0]}</span></h4>
    <h4 class="detail">Area: <span class="detail-info">${formatNumberWithCommas(+countryData.area)} km²</span></h4>
  `;
  actualDetails.appendChild(detailTable2);

  detailsText.appendChild(actualDetails);

  // Border countries
  const borderContainer = document.createElement('div');
  borderContainer.classList.add('border-container');
  const borderTitle = document.createElement('span');
  borderTitle.classList.add('title');
  borderTitle.textContent = 'Borders';
  borderContainer.appendChild(borderTitle);

  const borderCountries = document.createElement('div');
  borderCountries.classList.add('border-countries');
 
 if(countryData.borders){
  countryData.borders.slice(0, 4).forEach(border => {
    const borderTag = document.createElement('span');
    borderTag.classList.add('border-tag');
    borderTag.textContent = border;
    borderCountries.appendChild(borderTag);
  });
 }

  borderContainer.appendChild(borderCountries);
  detailsText.appendChild(borderContainer);

  // Append the image and details to the container
  container.appendChild(imageContainer);
  container.appendChild(detailsText);

  // Add the entire container to a specific element in the DOM
  countryContainer.appendChild(container);
}

// Call the function to fetch data
let cardsData  = await fetchData()
let cardsDataRender = cardsData.slice(0,8)

function createCard(data) {
  // Create the card container
  const card = document.createElement('div');
  console.log(data)
  card.dataset.key = data.name
  card.classList.add('card');

  // Create the image container
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  // Create the image element
  const img = document.createElement('img');
  img.src = data.flag;
  img.alt = data.altText;
  img.classList.add('card-image');
  imageContainer.appendChild(img);

  // Create the card text container
  const cardText = document.createElement('div');
  cardText.classList.add('card-text');

  // Add the title
  const title = document.createElement('h2');
  title.classList.add('title');
  title.textContent = data.country;
  cardText.appendChild(title);

  // Create the detail container
  const detailContainer = document.createElement('div');
  detailContainer.classList.add('detail-container');
 

  // Add population detail
  const populationDetail = createDetail('Population', formatNumberWithCommas(Number(data.population)));
  
  const name = createDetail('Name', data.name);
  detailContainer.appendChild(name)
  detailContainer.appendChild(populationDetail);

  // Add region detail
  const regionDetail = createDetail('Region', data.region);
  detailContainer.appendChild(regionDetail);

  // Add capital detail
  const capitalDetail = createDetail('Capital', data.capital);
  detailContainer.appendChild(capitalDetail);

  // Append the detail container to the card text
  cardText.appendChild(detailContainer);

  // Append image container and card text to the card
  card.appendChild(imageContainer);
  card.appendChild(cardText);

  return card;
}

// Helper function to create detail items
function createDetail(type, info) {
  const detail = document.createElement('h4');
  detail.classList.add('detail');

  const detailType = document.createElement('span');
  detailType.classList.add('detail-type');
  detailType.textContent = `${type}: `;

  const detailInfo = document.createElement('span');
  detailInfo.classList.add('detail-info');
  detailInfo.textContent = info;

  detail.appendChild(detailType);
  detail.appendChild(detailInfo);

  return detail;
}

// Example usage to render cards into a container
function renderCards(cardsData) {

  cardsData.forEach((data,i) => {
      const card = createCard(data,i);
      cardsContainer.appendChild(card);
  });
}

// Example data to populate the cards
searchBar.addEventListener('keydown',(e)=>{
  cardsContainer.innerHTML = ``
  const text = searchBar.value
  console.log(text)
  cardsDataRender = cardsData.filter((item) => item.name.includes(text.charAt(0).toUpperCase()+ text.slice(1)) ).slice(0,7)
  console.log(cardsDataRender)
  renderCards(cardsDataRender);
  
})
console.log(filterOptions)
filterOptions.addEventListener('change',(e)=>{
  console.log(filterOptions)
  cardsContainer.innerHTML = ``
  let selectedOption = e.target.value
  console.log(selectedOption)
  cardsDataRender = cardsData.filter((item) => item.region === selectedOption)
  console.log(cardsDataRender)
  renderCards(cardsDataRender);
})
cardsContainer.addEventListener('click',(e)=>{
 const selectedCard = e.target.closest('.card')
watchedCard = selectedCard.dataset.key
cardsContainer.classList.toggle('hide')
const actualCountryContainer = document.querySelector('.actual-country-details')
console.log(actualCountryContainer)
actualCountryContainer.classList.toggle('hide')
console.log(watchedCard)
const data = cardsData.find((data)=>data.name === watchedCard)
createCountryContainer(data)

// Call the render function with your data
  renderCards(cardsDataRender);
})
renderCards(cardsDataRender);

