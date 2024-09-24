//estoque/src/js/clientes.js

document.getElementById('add-client').addEventListener('click', addClient);
document.getElementById('search-bar').addEventListener('input', searchClient);

async function addClient() {
    const clientName = document.getElementById('client-name').value;
    const clientCpf = document.getElementById('client-cpf').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientRegistrationDate = document.getElementById('client-registration-date').value;

    if (clientName === '' || clientCpf === '' || clientEmail === '' || clientRegistrationDate === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const newClient = {
        nome: clientName,
        cpf: clientCpf,
        email: clientEmail,
        data_registro: clientRegistrationDate
    };

    try {
        const response = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClient)
        });

        const client = await response.json();
        addClientToTable(client);
    } catch (error) {
        alert('Erro ao adicionar cliente: ' + error.message);
    }

    document.getElementById('client-name').value = '';
    document.getElementById('client-cpf').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-registration-date').value = '';

    updateAlert();
}

function addClientToTable(client) {
    const clientList = document.getElementById('client-list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${client.id}</td>
        <td class="client-name">${client.nome}</td>
        <td>${client.cpf}</td>
        <td>${client.email}</td>
        <td>${client.data_registro}</td>
        <td>
            <button onclick="deleteClient(${client.id}, this)">Delete</button>
        </td>
    `;

    clientList.appendChild(row);
}

async function deleteClient(id, button) {
    try {
        await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
        button.parentNode.parentNode.remove();
        updateAlert();
    } catch (error) {
        alert('Erro ao deletar cliente: ' + error.message);
    }
}

function searchClient(event) {
    const searchTerm = event.target.value.toLowerCase();
    const clientList = document.getElementById('client-list').querySelectorAll('tr');

    clientList.forEach(row => {
        const clientName = row.querySelector('.client-name').textContent.toLowerCase();
        if (clientName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateAlert() {
    const clientList = document.getElementById('client-list').querySelectorAll('tr');
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';

    if (clientList.length === 0) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = 'Nenhum cliente cadastrado.';
        alertContainer.appendChild(alert);
    }
}

// Carregar clientes na inicialização
async function fetchClients() {
    try {
        const response = await fetch('/api/clientes');
        const clients = await response.json();
        clients.forEach(addClientToTable);
    } catch (error) {
        alert('Erro ao buscar clientes: ' + error.message);
    }
}

fetchClients();
