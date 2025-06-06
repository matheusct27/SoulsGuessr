var express = require('express');
var router = express.Router();

/* Página inicial */
router.get('/', function(req, res, next) {
  res.render('Locais'); // renderiza armas.ejs
});

/* Página de regras */
router.get('/regras', function(req, res, next) {
  res.render('regras');
});

/* Página de bosses */
router.get('/bosses', function(req, res, next) {
  res.render('bosses');
});

/* Página sobre */
router.get('/sobre', function(req, res, next) {
  res.render('sobre');
});

module.exports = router;