import React, { useState } from "react";
import axios from "axios";
import {
  FaSpinner,
  FaSadTear,
  FaSmile,
  FaHeart,
  FaAngry,
  FaFrownOpen,
  FaSurprise,
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./App.css";

const emotionLabels = ["sadness", "joy", "love", "anger", "fear", "surprise"];
const emotionIcons = {
  sadness: <FaSadTear />,
  joy: <FaSmile />,
  love: <FaHeart />,
  anger: <FaAngry />,
  fear: <FaFrownOpen />,
  surprise: <FaSurprise />,
};

function App() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/text/", {
        text: textInput,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const emotionName = result ? result.emotion : "";
  const emotionIcon = emotionIcons[emotionName];

  const data = result?.predict_percent.map((item) => ({
    name: emotionLabels[parseInt(item.label.replace("LABEL_", ""))],
    value: item.score,
  }));

  return (
    <div className="App">
      <h1>Emotion Detection</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter your text here"
          required
          className="text-input"
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      {loading && <FaSpinner className="loading-icon" />}

      {result && (
        <div className="result">
          <h2 className="emotion-header">
            Predicted Emotion: {emotionIcon}{" "}
            {emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} (
            {(result.predict_percent[0].score * 100).toFixed(2)}%)
          </h2>
          <PieChart width={400} height={400} className="pie-chart">
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <h3>Prediction Percentages:</h3>
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                {emotionIcons[item.name]} {item.name}:{" "}
                {(item.value * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
