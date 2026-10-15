const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.json');

// Função auxiliar para ler o banco de dados
function readDB() {
    try {
        if (!fs.existsSync(dbPath)) {
            const initialData = { jornadas: [], ocorrencias: [], contatos: [] };
            fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Erro ao ler banco de dados:", err);
        return { jornadas: [], ocorrencias: [], contatos: [] };
    }
}

// Função auxiliar para escrever no banco de dados
function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Erro ao gravar no banco de dados:", err);
    }
}

// Obter status do sistema
exports.getStatus = (req, res) => {
    res.json({ success: true, message: "Sistema operacional Sentinela One ativo com persistência." });
};

// Registar nova jornada
exports.iniciarJornada = (req, res) => {
    const { destino, duracaoMinutos, usuario } = req.body;
    
    if (!destino) {
        return res.status(400).json({ success: false, error: "Destino é obrigatório." });
    }

    let db = readDB();

    const novaJornada = {
        id: Date.now().toString(),
        destino,
        duracaoMinutos: duracaoMinutos || 30,
        usuario: usuario || "Anderson",
        status: "EM_ANDAMENTO",
        criadoEm: new Date()
    };

    db.jornadas.push(novaJornada);
    db.ocorrencias.unshift({
        texto: `Jornada iniciada para: ${destino}`,
        data: new Date()
    });

    writeDB(db);

    res.status(201).json({ success: true, data: novaJornada });
};

// Obter histórico de ocorrências
exports.getHistorico = (req, res) => {
    const db = readDB();
    res.json({ success: true, data: db.ocorrencias });
};

// Gerir contatos
exports.getContatos = (req, res) => {
    const db = readDB();
    res.json({ success: true, data: db.contatos });
};

exports.adicionarContato = (req, res) => {
    const { nome, telefone, relacao } = req.body;
    if (!nome || !telefone) {
        return res.status(400).json({ success: false, error: "Nome e telefone são obrigatórios." });
    }

    let db = readDB();
    const novoContato = { name: nome, phone: telefone, relation: relacao || "Amigo(a)" };
    db.contatos.push(novoContato);
    
    db.ocorrencias.unshift({
        texto: `Contato adicionado: ${nome}`,
        data: new Date()
    });

    writeDB(db);

    res.status(201).json({ success: true, data: novoContato });
};
