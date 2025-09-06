# 🤖 AI Smart Restaurant Assistant

An intelligent AI-powered chatbot built with **Node.js**, **LangChain**, and **Google Gemini 2.5 Flash**. This assistant helps users inquire about today’s **breakfast, lunch, or dinner** and responds using an LLM-powered tool-calling agent.

---

## 🧠 What It Does

The chatbot uses a LangChain tool-enabled agent to understand natural language queries such as:

- "What's for breakfast today?"
- "Tell me the lunch menu."
- "Do we have dinner options?"

The agent then uses a custom tool (`get-menu`) to fetch the appropriate response for **breakfast**, **lunch**, or **dinner**.

---

## 📁 Project Structure

smart-restaurant-assistant/
├── App.js # Main Express server and LangChain logic
├── public/
│ └── index.html # Chatbot UI (frontend)
├── .env # Environment variables
├── package.json # Project metadata and dependencies
└── README.md # Project documentation