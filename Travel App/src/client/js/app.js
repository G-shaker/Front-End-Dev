// Personal API Key for OpenWeatherMap API
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=ba128eb12cc892a3393c19bc3194a0d9";

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
    postData('/add', {temp: result.main.temp, date: newDate, resp:input});
  })
  .then(data=>{
    updateUI();
  })
};

/* Function to GET Web API Data */
const getData = async (baseURL, zip, key)=>{
  const res = await fetch(baseURL+`${zip}&units=metric`+key)
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
const updateUI = async() => {
  const request = await fetch('/all');
  try{
   const allData = await request.json();
   console.log(allData);
   // console.log("updating UI");
   document.getElementById('temp').innerHTML = "Temperature: " + allData.temp+" °C";
   document.getElementById('date').innerHTML = "Date: "+ allData.date;
   document.getElementById('content').innerHTML = "Content: "+ allData.resp;

 }catch(error){
   console.log("error", error);
 }
};

export{
  performAction
}
