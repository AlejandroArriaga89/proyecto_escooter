const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 8000; // Cambia a 8000

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/escooter", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const Compra = mongoose.model("compra", {});
const Cliente = mongoose.model("cliente", {});

// Rutas de API
app.get("/api/clientData", async (req, res) => {
  try {
    const totalClients = await Cliente.countDocuments();
    const totalOrders = await Compra.countDocuments();
    const totalProducts = await getTotalProducts();

    res.json({
      totalClients,
      totalOrders,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching client data:", error);
    res.status(500).json({ error: "Error fetching client data" });
  }
});

app.get("/api/salesData", async (req, res) => {
  try {
    const weeklySales = (
      await Compra.find({
        fecha: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      })
    ).reduce((acc, compra) => acc + compra.total, 0);

    const monthlySales = (
      await Compra.find({
        fecha: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      })
    ).reduce((acc, compra) => acc + compra.total, 0);

    const yearlySales = (
      await Compra.find({
        fecha: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      })
    ).reduce((acc, compra) => acc + compra.total, 0);

    console.log(res.json.length);

    res.json({
      weekly: weeklySales,
      monthly: monthlySales,
      yearly: yearlySales,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Error fetching sales data" });
  }
});

// Función para obtener el total de productos desde la base de datos
async function getTotalProducts() {
  try {
    const totalProducts = await Compra.aggregate([
      {
        $project: {
          numberOfProducts: { $size: { $objectToArray: "$productos" } },
        },
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: "$numberOfProducts" },
        },
      },
    ]);

    return totalProducts.length > 0 ? totalProducts[0].totalProducts : 0;
  } catch (error) {
    console.error("Error fetching total products:", error);
    return 0;
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
