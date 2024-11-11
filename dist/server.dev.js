"use strict";

var express = require('express');

var _require = require('mongodb'),
    MongoClient = _require.MongoClient,
    ServerApiVersion = _require.ServerApiVersion;

var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());
app.use(express["static"]('public'));
var uri = "mongodb+srv://dticona1038:t1c0m4n09@cluster0.mh56n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
app.get('/api/databases', function _callee(req, res) {
  var databasesList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(client.db().admin().listDatabases());

        case 5:
          databasesList = _context.sent;
          res.json(databasesList.databases);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
app.get('/api/collections/:dbName', function _callee2(req, res) {
  var db, collections;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
          db = client.db(req.params.dbName);
          _context2.next = 6;
          return regeneratorRuntime.awrap(db.listCollections().toArray());

        case 6:
          collections = _context2.sent;
          res.json(collections);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
app.get('/api/data/:dbName/:collectionName', function _callee3(req, res) {
  var db, collection, _req$query, day, month, year, filter, selectedDate, documents, previousRecords;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
          db = client.db(req.params.dbName);
          collection = db.collection(req.params.collectionName);
          _req$query = req.query, day = _req$query.day, month = _req$query.month, year = _req$query.year;
          filter = {};
          selectedDate = null;

          if (year && month && day) {
            selectedDate = {
              gestion: parseInt(year),
              mes: parseInt(month),
              dia: parseInt(day)
            };
            filter = selectedDate;
          } else {
            if (year) filter.gestion = parseInt(year);
            if (month) filter.mes = parseInt(month);
            if (day) filter.dia = parseInt(day);
          }

          console.log('Filtro aplicado:', filter);

          if (!selectedDate) {
            _context3.next = 17;
            break;
          }

          _context3.next = 13;
          return regeneratorRuntime.awrap(collection.find({
            $or: [{
              gestion: selectedDate.gestion,
              mes: selectedDate.mes,
              dia: {
                $lte: selectedDate.dia
              }
            }, {
              gestion: selectedDate.gestion,
              mes: {
                $lt: selectedDate.mes
              }
            }, {
              gestion: {
                $lt: selectedDate.gestion
              }
            }]
          }).sort({
            gestion: -1,
            mes: -1,
            dia: -1
          }).limit(10).toArray());

        case 13:
          previousRecords = _context3.sent;
          documents = previousRecords;
          _context3.next = 20;
          break;

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(collection.find(filter).sort({
            gestion: -1,
            mes: -1,
            dia: -1
          }).limit(10).toArray());

        case 19:
          documents = _context3.sent;

        case 20:
          res.json(documents);
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.error('Error en la consulta:', _context3.t0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
