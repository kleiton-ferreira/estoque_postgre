const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 8080;

// Configuração do Pool de Conexões com o PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'estoque',
    password: 'root',
    port: 5432,
});

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());

// Rotas para Produtos

// Rota para obter todos os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Erro ao buscar produtos: ' + err.message);
    }
});

// Rota para adicionar um novo produto
app.post('/api/produtos', async (req, res) => {
    const { nome, quantidade, preco, desconto } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO produtos (nome, quantidade, preco, desconto) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, quantidade, preco, desconto]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Erro ao adicionar produto: ' + err.message);
    }
});

// Rota para deletar um produto
app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send('Erro ao deletar produto: ' + err.message);
    }
});

// Rota para atualizar um produto
app.put('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, quantidade, preco, desconto } = req.body;
    try {
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, quantidade = $2, preco = $3, desconto = $4 WHERE id = $5 RETURNING *',
            [nome, quantidade, preco, desconto, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Erro ao atualizar produto: ' + err.message);
    }
});

// Rotas para Usuários

// Rota para obter todos os usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Erro ao buscar usuários: ' + err.message);
    }
});

// Rota para adicionar um novo usuário
app.post('/api/usuarios', async (req, res) => {
    const { nome, cpf, telefone, email, funcao } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nome, cpf, telefone, email, funcao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, cpf, telefone, email, funcao]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Erro ao adicionar usuário: ' + err.message);
    }
});

// Rota para deletar um usuário
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send('Erro ao deletar usuário: ' + err.message);
    }
});


// Rotas para Clientes

// Rota para obter todos os clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Erro ao buscar clientes: ' + err.message);
    }
});

// Rota para adicionar um novo cliente
app.post('/api/clientes', async (req, res) => {
    const { nome, cpf, email, data_registro } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, cpf, email, data_registro) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, cpf, email, data_registro]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Erro ao adicionar cliente: ' + err.message);
    }
});

// Rota para deletar um cliente
app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send('Erro ao deletar cliente: ' + err.message);
    }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
