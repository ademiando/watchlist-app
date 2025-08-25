export default async function handler(req, res) {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'BINANCE:BTCUSDT'];
  
  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: 'Finnhub API key not configured.' });
  }

  try {
    const promises = symbols.map(symbol => 
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`).then(r => r.json())
    );
    const results = await Promise.all(promises);
    
    const marketData = {};
    symbols.forEach((symbol, index) => {
      marketData[symbol] = { price: results[index].c, prevClose: results[index].pc };
    });
    
    res.status(200).json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
}
