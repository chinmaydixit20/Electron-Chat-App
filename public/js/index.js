const register = document.querySelector('#reg-form');
const login = document.querySelector('#login-form')
const electron = require('electron');
const { ipcRenderer } = electron;

register.addEventListener('submit', (e) => {
    e.preventDefault();
    const regUser = {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
    }
    console.log(regUser);
    axios.post('http://localhost:3000/user/register', regUser)
        .then(res => alert(res.data));

    e.target.elements.username.value = '';
    e.target.elements.password.value = '';    
});


login.addEventListener('submit', (e) => {
    
    e.preventDefault();
    const user = {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
    }
    axios.post('http://localhost:3000/user/login', user)
        .then(res => {
            if(res.data) {
                ipcRenderer.send('userLogin', user)
                window.location = '/chat.html';
            }
            else {
                e.target.elements.username.value = ''
                e.target.elements.password.value = ''
                //alert('Invalid Username/ Password!');
                location.reload();
            }
        })
        .catch(err => alert(err));
});



