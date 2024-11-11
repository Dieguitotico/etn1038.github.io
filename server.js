const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const uri = "mongodb+srv://dticona1038:t1c0m4n09@cluster0.mh56n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/api/databases', async (req, res) => {
  try {
    await client.connect();
    const databasesList = await client.db().admin().listDatabases();
    res.json(databasesList.databases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collections/:dbName', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(req.params.dbName);
    const collections = await db.listCollections().toArray();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/data/:dbName/:collectionName', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(req.params.dbName);
    const collection = db.collection(req.params.collectionName);
    
    const { day, month, year } = req.query;
    let filter = {};
    let selectedDate = null;

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

    let documents;
    if (selectedDate) {
      const previousRecords = await collection.find({
        $or: [
          {
            gestion: selectedDate.gestion,
            mes: selectedDate.mes,
            dia: { $lte: selectedDate.dia }
          },
          {
            gestion: selectedDate.gestion,
            mes: { $lt: selectedDate.mes }
          },
          {
            gestion: { $lt: selectedDate.gestion }
          }
        ]
      })
      .sort({ gestion: -1, mes: -1, dia: -1 })
      .limit(10)
      .toArray();

      documents = previousRecords;
    } else {
      documents = await collection.find(filter)
        .sort({ gestion: -1, mes: -1, dia: -1 })
        .limit(10)
        .toArray();
    }

    res.json(documents);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});