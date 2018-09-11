function genActa(i) {
  var vid = document.getElementById(i).name;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: vid
    })
  }

  fetch('/Vistos', options)
  .then(response => response.json())
  .then(post => {
    alert(post);
  })

  var value=0;
}

function genBlock(i) {
  var vid = document.getElementById(i).name;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: vid
    })
  }

  fetch('/Vistos', options)
  .then(response => response.json())
  .then(post => {
    alert(post);
  })

  var value=0;
}
