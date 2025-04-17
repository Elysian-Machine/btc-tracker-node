const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

ongooose.connect("mongodb://localhost:27017/btc_prices", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const priceSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
  timestamp: { type: Date, default: Date.now },
});

const Price = mongoose.model("Price", priceSchema);

// Funcao para buscar pre'áo da Binance
async function fetchBTCPrice() {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const { symbol, price } = response.data;
    const newPrice = new Price({ symbol, price: parseFloat(price) });
    await newPrice.save();
    console.log(`[` ${new Date().toTString()}] BTC Price: $${price}`);
  } catch (err) {
    console.error("Erro ao buscar/preencher pre'áo:", err.message);
  }
}

// Job perédiodico
setInterval(fetchBTCPrice, 5000);

app.get("/", (req, res) => {
  res.send("BTC Tracker ativo 🚀 ");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});