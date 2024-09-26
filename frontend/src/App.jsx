import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const ws = useRef(null);

  // Connect to WebSocket server on component mount
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    ws.current.onmessage = (event) => {
      // Receive messages from the server and update chat
      setChat((prevChat) => [...prevChat, event.data]);
    };

    ws.current.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && message) {
      const messageData = {
        name,
        message,
      };
      // Send the message to the WebSocket server
      ws.current.send(JSON.stringify(messageData));
      setMessage(""); // Clear message input
    }
  };

  return (
    <div className="App">
      <h1>WebSocket Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
