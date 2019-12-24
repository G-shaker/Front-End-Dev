// Personal API Key for OpenWeatherMap API
// const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
// const apiKey = "&appid=ba128eb12cc892a3393c19bc3194a0d9";

const baseURL = "http://api.geonames.org/postalCodeSearchJSON?placename=";
const apiKey = "&username=gshaker";

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
    console.log(result.postalCodes[0]);
    const input = document.getElementById('feelings').value;
    const ob = result.postalCodes[0];
    postData('/add', {lat: ob.lat, long: ob.lng, countryCode: ob.countryCode});
  })
  .then(data=>{
    updateUI();
  })
};

/* Function to GET Web API Data */
const getData = async (baseURL, zip, key)=>{
  // const res = await fetch(baseURL+`${zip}&units=metric`+key)

  const res = await fetch(baseURL+`${zip}`+key)
  console.log("printing data after:")

  try {
    console.log("trying:")
    const data = await res.json();
    console.log("printing data:")
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
const updateUI = async() => {
  const request = await fetch('/all');
  try{
   const allData = await request.json();
   console.log(allData);
   // console.log("updating UI");
   document.getElementById('lat').innerHTML = "Latitude: " + allData.lat;
   document.getElementById('long').innerHTML = "Longitude: "+ allData.long;
   document.getElementById('country').innerHTML = "Country: "+ allData.countryCode;

 }catch(error){
   console.log("error", error);
 }
};

export{
  performAction
}
