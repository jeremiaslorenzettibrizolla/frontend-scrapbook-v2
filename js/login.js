// axios.defaults.baseURL = 'https://backend-scrapbook-v2.herokuapp.com/api/v2';
axios.defaults.baseURL = 'http://localhost:8080/api/v2';

const signInBtn = document.querySelector('#sign-in-btn');
const signUpBtn = document.querySelector('#sign-up-btn');
const container = document.querySelector('.container');

signUpBtn.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
});

signInBtn.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
});

const username = document.getElementById('register-username');
const email = document.getElementById('register-email');
const password = document.getElementById('register-password');
const repeatPassword = document.getElementById('repeat-password');
const emailLogin = document.getElementById('current-email');
const passwordLogin = document.getElementById('current-password');

function alerts(type, message) {
    Swal.fire({
        position: 'top',
        icon: `${type}`,
        title: `${message}`,
        showConfirmButton: false,
        timer: 2500,
    });
    return;
}

async function addNewUser(event) {
    event.preventDefault();

    const { data, status } = await axios.get('/users');

    for (let user of data) {
        if (email.value === user.email) {
            alerts('warning', 'Email já cadastrado');
            email.value = '';
            return;
        }
    }

    if (!username.value || !password.value) {
        return alerts('warning', 'Preencha todos os campos');
    }

    if (password.value !== repeatPassword.value) {
        return alerts('warning', 'As senhas não iguais');
    }

    if (password.value.length < 6) {
        return alerts('warning', 'A senha deve ter no mínimo 6 caracteres');
    }

    if (!email.value) {
        return alerts('warning', 'Preencha o email');
    }

    const registerUser = axios.post('/users', {
        username: username.value,
        email: email.value,
        password: password.value,
    });

    username.value = '';
    email.value = '';
    password.value = '';
    repeatPassword.value = '';

    alerts('success', 'Usuário cadastrado com sucesso');
    container.classList.remove('sign-up-mode');
}

async function login(event) {
    event.preventDefault();

    const { data } = await axios.get('/users');

    for (let user of data) {
        if (
            user.email === emailLogin.value &&
            user.password === passwordLogin.value
        ) {
            localStorage.setItem('userUID', user.uid);
            localStorage.setItem('username', user.username);

            window.location.href = 'scrapbook.html';
        }
    }
}
