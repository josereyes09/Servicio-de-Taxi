document.getElementById('taxi-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const destination = document.getElementById('destination').value;
    const email = document.getElementById('email').value;


    fetch('/send-taxi-request', {
        method: 'post',
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify({ name, location, destination, email })
    })
    .then (response => response.json())
    .then (data => {
        const responseMessage = `
    <p>¡Gracias, ${name}! Tu taxi está en camino a ${location} y te llevará a ${destination}. En 10 minutos, ¡Disfruta tu viaje!</p>
    <img src="nissan.jpg" alt="taxi asignado" class="taxi-image">
    `;

    document.getElementById('response-message').innerHTML = responseMessage;
        
    })
    
    .catch( error => console.error('error al enviar los datos:', error));


    document.getElementById('taxi-form').reset();


    alert('correo enviado correctamente')

});








