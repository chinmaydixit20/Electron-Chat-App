const register = document.querySelector('#reg-form');
const login = document.querySelector('#login-form')

register.addEventListener('submit', (e) => {
    e.preventDefault();
    //console.log(e.target.elements.username.value);
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
    
    //e.preventDefault();
    //console.log(e.target.elements.username.value);
    const regUser = {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
    }
    console.log(regUser);
    axios.post('http://localhost:3000/user/login', regUser)
        .then(res => {
            console.log(res.data);
        });
       

     
    
    // window.location = '/chat.html';
});



