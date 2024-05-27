const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function connectToDatabase() {
  const uri = process.env.SERVER_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // Añade estas opciones para deshabilitar la encriptación del lado del cliente
  try {
    await client.connect();
    // console.log("Connected to the database");
    return client.db("escooter");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

async function getSalesData() {
  const db = await connectToDatabase();
  const salesCollection = db.collection("compras");
  try {
    // Aquí realizas tu consulta a la colección de ventas
    const salesData = await salesCollection.find({}).toArray();
    return salesData;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
}

async function getClientData() {
  const db = await connectToDatabase();
  const clientCollection = db.collection("cliente");
  try {
    // Aquí realizas tu consulta a la colección de clientes
    const clientData = await clientCollection.find({}).toArray();
    return clientData;
  } catch (error) {
    console.error("Error fetching client data:", error);
    throw error;
  }
}

module.exports = { getSalesData, getClientData };
