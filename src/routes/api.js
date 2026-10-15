const express = require('express');
const router = express.Router();
const controller = require('../controllers/sentinelaController');

router.get('/status', controller.getStatus);
router.post('/jornada', controller.iniciarJornada);
router.get('/historico', controller.getHistorico);
router.get('/contatos', controller.getContatos);
router.post('/contatos', controller.adicionarContato);

module.exports = router;
