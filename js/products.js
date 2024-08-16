
const apiUrl = 'https://japceibal.github.io/emercado-api/cats_products/101.json';


fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data from https://japceibal.github.io/emercado-api/cats_products/101.json: ', error);
    });