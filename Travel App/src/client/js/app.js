const baseURL = "http://api.geonames.org/postalCodeSearchJSON?placename=";
const apiKey = "&username=gshaker";

const darkSkyApi = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/75ecb47286612ef81f169a2f8e9eac7e/";

// Create a new date instance dynamically with JS
let d = new Date();
let month = d.getMonth()+1;
let newDate = month +'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e){
  const zip =  document.getElementById('zip').value;
  getData(baseURL, zip, apiKey)
  .then(result=>{
    console.log(result);
    const input = document.getElementById('feelings').value;
    const travelD = document.getElementById('travelDate').value.split("-");

    const year= travelD[0];
    const month = travelD[1];
    const day = travelD[2];
    const time = year+ "-"+ month+ "-"+ day+ "T12:00:00";
    const countdown = getCountdown(new Date(year, month-1, day));

    postData('/add', {lat: result.lat, long: result.lng, countryCode: result.countryCode, countdown: countdown});
    return getWeather(darkSkyApi, result.lat, result.lng, time)
  })
  .then(weatherData=>{
    postData('/weather', {summary: weatherData.daily.data[0].summary});
    return "weather";
  })
  .then(data=>{
    updateUI(data);
  })
};

function getCountdown(date){
  const today = new Date();
  console.log("date: ", date)

  const time_diff = date.getTime() - today.getTime();
  const day_diff = time_diff/(1000 * 3600 * 24);

  console.log("Days difference: ", day_diff);
  return day_diff;
}

/* Function to GET Web API Data */
const getData = async (baseURL, zip, key)=>{
  // const res = await fetch(baseURL+`${zip}&units=metric`+key)

  const res = await fetch(baseURL+`${zip}`+key)

  try {
    const data = await res.json();
    return data.postalCodes[0];
  }  catch(error) {
    console.log("error", error);
  }
};

/* Function to GET DarkSky API Data */
const getWeather = async (baseURL, long, lat, time)=>{
  console.log("getting weather")
  const res = await fetch(baseURL+ long+ ","+ lat+ ","+ time)

  try {
    const data = await res.json();
    console.log("weather data:")
    console.log(data)
    return data;
  }  catch(error) {
    console.log("error", error);
  }
};

/* Function to POST data */
const postData = async ( url = '', data = {})=>{
  console.log(data);

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    // Body data type must match "Content-Type" header
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    console.log(newData);
    return newData;
  }catch(error) {
    console.log("error", error);
  }
};

/* Function that retrieves data from server to update UI elements */
const updateUI = async(data) => {
  console.log("updating UI")
  console.log(data)

  const request = await fetch('/all');
  try{
   const allData = await request.json();
   console.log(allData);
   // console.log("updating UI");
   document.getElementById('lat').innerHTML = "Latitude: " + allData.lat;
   document.getElementById('long').innerHTML = "Longitude: "+ allData.long;
   document.getElementById('country').innerHTML = "Country: "+ allData.countryCode;
   document.getElementById('countdown').innerHTML = "Countdown: "+ allData.countdown + "days";

 }catch(error){
   console.log("error", error);
 }
};

export{
  performAction
}
