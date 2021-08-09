// axios.defaults.baseURL = 'https://backend-scrapbook-v2.herokuapp.com/api/v2';
axios.defaults.baseURL = 'http://localhost:8080/api/v2';

const userUID = localStorage.getItem('userUID');
const username = localStorage.getItem('username');

window.onload = () => {
    Swal.fire({
        title: `Seja bem vindo ${username}`,
        width: 600,
        padding: '3em',
        background: '#fff url(../img/Pattern-Randomized.svg)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("../img/homer_simpson.gif")
          top
          no-repeat
        `,
    });
};

async function getUser(event) {
    event.preventDefault();

    const { data } = await axios.get(`/users/${userUID}`);

    const user = {
        username: data.username,
        email: data.email,
    };

    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
}

async function updateUser(event) {
    event.preventDefault();

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const user = {
        username: username.value,
        email: email.value,
        password: password.value,
    };

    if (!user.password) {
        alerts('warning', 'O campo senha está vazio');
        return;
    }

    const { data } = await axios.put(`/users/${userUID}`, user);

    localStorage.setItem('username', user.username);
}

function logout(event) {
    event.preventDefault();

    window.location.href = './login.html';
    localStorage.removeItem('username');
    localStorage.removeItem('userUID');
}

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

async function loadTable() {
    const scrapbook = document.getElementById('scrapbook');

    const { data } = await axios.get(`/users/${userUID}/scraps`);

    if (data.length === 0) {
        alerts('info', 'Você ainda não adicionou nenhum recado');
        return;
    }

    scrapbook.innerHTML = '';

    if (data) {
        for (let scrap of data) {
            const line = document.createElement('tr');
            line.innerHTML = `
            <th scope="row" class"text-cel" id="${scrap.uid}">
                ${data.indexOf(scrap) + 1}
            </th>
            <td class"text-cel">${scrap.title}</td>
            <td class"text-cel">${scrap.description}</td>
            <td>
                <div>
                    <button class="col-1 btnAction btn-edit"
                        onclick="updateScrap(event, '${scrap.uid}')">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="col-1 btnAction btn-delete"
                        onclick="deleteScrap(event, '${scrap.uid}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </td>
            `;
            scrapbook.appendChild(line);
        }
    }
}
loadTable();

async function postScrap(event) {
    event.preventDefault();

    const uid = document.getElementById('uid');
    const title = document.getElementById('title');
    const description = document.getElementById('description');

    if (!title.value) {
        alerts('warning', 'O campo título está vazio');
        return;
    }

    const scrap = {
        title: title.value,
        description: description.value,
        userUID: userUID,
    };

    let response;

    if (!uid.value) {
        response = await axios.post(`/users/${userUID}/scraps`, scrap);
    } else {
        response = await axios.put(
            `/users/${userUID}/scraps/${uid.value}`,
            scrap,
        );
    }

    if (response.config.method === 'post') {
        alerts('success', 'Recado postado com sucesso');
    } else {
        alerts('success', 'Recado alterado com sucesso');
    }

    uid.value = '';
    title.value = '';
    description.value = '';
    loadTable();
}

async function updateScrap(event, uid) {
    event.preventDefault();

    const { data } = await axios.get(`/users/${userUID}/scraps/${uid}`);
    const scrap = {
        editUid: data.uid,
        editTitle: data.title,
        editDescription: data.description,
    };

    document.getElementById('uid').value = scrap.editUid;
    document.getElementById('title').value = scrap.editTitle;
    document.getElementById('description').value = scrap.editDescription;

    loadTable();
}

async function deleteScrap(event, uid) {
    event.preventDefault();

    await axios.delete(`/users/${userUID}/scraps/${uid}`);

    alerts('success', 'Recado excluído com sucesso');

    loadTable();
}
