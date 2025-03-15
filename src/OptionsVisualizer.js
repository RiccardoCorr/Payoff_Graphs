import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const OptionsVisualizer = () => {
  // Default parameters
  const [strikePrice, setStrikePrice] = useState(100);
  const [premium, setPremium] = useState(10);
  const [range, setRange] = useState(50);
  
  // Calculate data points for the chart
  const generateData = () => {
    const data = [];
    const minPrice = Math.max(strikePrice - range, 1);
    const maxPrice = strikePrice + range;
    
    for (let price = minPrice; price <= maxPrice; price += 5) {
      const longCallPayoff = Math.max(0, price - strikePrice) - premium;
      const shortCallPayoff = Math.min(premium, premium - (price - strikePrice));
      const longPutPayoff = Math.max(0, strikePrice - price) - premium;
      const shortPutPayoff = Math.min(premium, premium - (strikePrice - price));
      
      data.push({
        price,
        longCall: longCallPayoff,
        shortCall: shortCallPayoff,
        longPut: longPutPayoff,
        shortPut: shortPutPayoff
      });
    }
    
    return data;
  };
  
  const data = generateData();
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Options Payoff Profiles</h2>
      
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Strike Price ($)</label>
          <input
            type="number"
            value={strikePrice}
            onChange={(e) => setStrikePrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Premium ($)</label>
          <input
            type="number"
            value={premium}
            onChange={(e) => setPremium(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="0.1"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price Range ($)</label>
          <input
            type="number"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="10"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <LineChart width={600} height={400} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="price" 
            label={{ value: 'Underlying Price ($)', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            label={{ value: 'Profit/Loss ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <ReferenceLine x={strikePrice} stroke="#666" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="longCall" stroke="#8884d8" name="Long Call" dot={false} />
          <Line type="monotone" dataKey="shortCall" stroke="#82ca9d" name="Short Call" dot={false} />
          <Line type="monotone" dataKey="longPut" stroke="#ff7300" name="Long Put" dot={false} />
          <Line type="monotone" dataKey="shortPut" stroke="#0088fe" name="Short Put" dot={false} />
        </LineChart>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border rounded">
          <h3 className="font-bold">Long Call</h3>
          <p>Break-even: ${(strikePrice + premium).toFixed(2)}</p>
          <p>Max Loss: ${premium.toFixed(2)} (limited)</p>
          <p>Max Profit: Unlimited</p>
        </div>
        <div className="p-3 border rounded">
          <h3 className="font-bold">Short Call</h3>
          <p>Break-even: ${(strikePrice + premium).toFixed(2)}</p>
          <p>Max Profit: ${premium.toFixed(2)} (limited)</p>
          <p>Max Loss: Unlimited</p>
        </div>
        <div className="p-3 border rounded">
          <h3 className="font-bold">Long Put</h3>
          <p>Break-even: ${(strikePrice - premium).toFixed(2)}</p>
          <p>Max Loss: ${premium.toFixed(2)} (limited)</p>
          <p>Max Profit: ${(strikePrice - premium).toFixed(2)} (if price = 0)</p>
        </div>
        <div className="p-3 border rounded">
          <h3 className="font-bold">Short Put</h3>
          <p>Break-even: ${(strikePrice - premium).toFixed(2)}</p>
          <p>Max Profit: ${premium.toFixed(2)} (limited)</p>
          <p>Max Loss: ${(strikePrice - premium).toFixed(2)} (if price = 0)</p>
        </div>
      </div>
    </div>
  );
};

export default OptionsVisualizer;