async function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    const formText = document.getElementById('input').value
    const result = document.getElementById('results')

    if(!Client.checkURL(formText)){
      result.textContent= "Not a valid URL"
      return
    }

    console.log("::: Form Submitted :::")
    const someData = {
      url: formText
    };
    const res = await postData('http://localhost:8081/save', someData)
    result.textContent = `The article polarity is and polarity confidence are: ${res.message} and ${res.message1}`
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

export { handleSubmit }
