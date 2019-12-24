const baseURL = "http://api.geonames.org/postalCodeSearchJSON?placename=";
const apiKey = "&username=gshaker";
const darkSkyApi = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/75ecb47286612ef81f169a2f8e9eac7e/";
const pixabayAPI = "https://pixabay.com/api/?key=14729819-3098afc5c960270fec699fa97&image_type=photo&q=";

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
    const startDate = document.getElementById('startDate').value.split("-");
    const endDate = document.getElementById('endDate').value.split("-");

    const year= startDate[0];
    const month = startDate[1];
    const day = startDate[2];
    const time = year+ "-"+ month+ "-"+ day+ "T12:00:00";
    const countdown = getDifference(new Date(year, month-1, day), new Date());
    const tripLength = getDifference(new Date(endDate[0], endDate[1]-1, endDate[2]), new Date(startDate[0], startDate[1]-1, startDate[2]));
    console.log(tripLength.toFixed);
    postData('/add', {city: zip, countryCode: result.countryCode, countdown: countdown, tripLen: tripLength});

    const str = result.lat+ ","+ result.lng+ ","+ time;
    console.log(str);
    return getD(darkSkyApi, str);
  })
  .then(weatherData=>{
    postData('/weather', {summary: weatherData.daily.data[0].summary});
    return getD(pixabayAPI, zip);
  })
  .then(data=>{
    updateUI(data);
  })
};

//function to calculate difference between two dates
function getDifference(date1, date2){
  const time_diff = date1.getTime() - date2.getTime();
  const day_diff = time_diff/(1000 * 3600 * 24);

  console.log("Days difference: ", day_diff);
  return day_diff;
}

/* Function to GET geonames API Data */
const getData = async (baseURL, zip, key)=>{
  const res = await fetch(baseURL+`${zip}`+key)

  try {
    const data = await res.json();
    return data.postalCodes[0];
  }  catch(error) {
    console.log("error", error);
  }
};

/* Function to GET API Data */
const getD = async (baseURL, str)=>{
  console.log("getting api Data")
  const res = await fetch(baseURL+`${str}`)
  try {
    const data = await res.json();
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
  const imgURL = data.hits[0].largeImageURL;
  document.getElementById('image').src = imgURL;

  const request = await fetch('/all');
  try{
   const allData = await request.json();
   console.log(allData);
   document.getElementById('city').innerHTML = "City: " + allData.city;
   document.getElementById('country').innerHTML = "Country: "+ allData.countryCode;
   document.getElementById('countdown').innerHTML = "Countdown: "+ allData.countdown + " days";
   document.getElementById('tripLen').innerHTML = "Trip length: "+ allData.tripLen + " days";

 }catch(error){
   console.log("error", error);
 }

 const req = await fetch('/weather');
 try{
  const allData = await req.json();
  console.log(allData);
  document.getElementById('weather').innerHTML = "Weather summary: " + allData.summary;
}catch(error){
  console.log("error", error);
}


};

export{
  performAction
}
