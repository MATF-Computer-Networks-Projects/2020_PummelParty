const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    const num_user = document.getElementById('num_users').value;
    const num = parseInt(num_user);

    const valid_input = validateInput(username, room);
    if (valid_input) openHtml(num);
    else e.preventDefault(); 
})

function validUsername(username) {
    const regex = /^[A-Za-z][A-Za-z0-9]{1,15}$/
    const found = username.match(regex);

    return (found === null ? false : true);
}

function validRoom(room) {
    const regex = /^[A-Za-z0-9]{3,10}$/
    const found = room.match(regex);

    return (found === null ? false : true);
}

function validateInput(username, room) {
    if (!validUsername(username)) {
        errorMessage('Wrong username');
        return false;
    } else if (!validRoom(room)) {
        errorMessage('Wrong room');
        return false;
    }
    return true;
}

function openHtml(num_user) {
    
    if (num_user === 2) {
        form.action = "game2.html";
    } else if (num_user === 3) {
        form.action = "game3.html";
    }
    else if ( num_user === 4) {
        form.action = "game4.html";
    }
}

function errorMessage(errorMsg) {
    paragraph = document.getElementsByClassName('error-message')[0]
    if (paragraph !== undefined) {
        document.querySelector('.join-main').removeChild(paragraph);
    }

    const p = document.createElement('p');
    p.innerText = errorMsg;
    p.classList.add('error-message');
    document.querySelector('.join-main').appendChild(p);
}
