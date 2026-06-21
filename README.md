# Chat Docs

**Conversational Document Intelligence & Retrieval-Augmented Generation (RAG) Platform**

A full-stack web application that enables intelligent conversations about PDF documents using advanced language models, vector embeddings, and contextual retrieval. Upload your documents and chat with an AI assistant that understands your content through semantic search and context-aware responses.

**Live Demo:** [https://chatdocs-5938.onrender.com/](https://chatdocs-5938.onrender.com/)

---

## Features

- **📄 PDF Upload & Processing** - Seamlessly upload PDF documents with drag-and-drop interface and real-time ingestion feedback
- **🧠 Intelligent Document Chunking** - Automatic splitting of documents into optimized chunks with contextual overlap
- **🔍 Vector Embeddings** - Google Generative AI embeddings for semantic understanding of document content
- **💾 Vector Database Integration** - Persistent storage of embeddings in ChromaDB with cloud-based retrieval
- **🤖 Context-Aware Chat** - AI-powered conversations that reference your documents for accurate, grounded responses
- **💬 Chat History Management** - Maintains conversation history for coherent multi-turn interactions with context preservation
- **⚡ Streaming Responses** - Real-time token streaming for responsive user experience
- **🔄 Query Condensation** - Intelligent query rephrasing to handle follow-up questions and coreferences in chat history
- **🎨 Modern UI** - Professional, dark-themed interface with real-time status updates and smooth animations
- **🔐 Secure Processing** - Client-side upload handling with automatic cleanup and isolated ingestion buffers

---

## Tech Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **JavaScript (ES6+)** - Modern async/await patterns and DOM manipulation
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **Marked** - Markdown parsing for formatted responses
- **Font Awesome** - Icon library for UI elements
- **Fetch Event Source** - Server-sent events handling for streaming responses

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework (v5.2.1)
- **Multer** - File upload middleware with memory storage
- **pdf-parse** - PDF extraction and parsing
- **Morgan** - HTTP request logging

### AI & ML
- **LangChain** - Orchestration framework for LLM applications
  - `@langchain/core` - Core abstractions
  - `@langchain/google-genai` - Google Generative AI integration
  - `@langchain/community` - Community integrations
  - `@langchain/textsplitters` - Text splitting utilities
- **Google Generative AI (Gemini)** - Language model and embeddings API
  - Model: `gemini-2.5-flash` (temperature: 0.2)
  - Embeddings: `models/gemini-embedding-001`

### Vector Database
- **ChromaDB** - Cloud-based vector database for embedding storage and retrieval
- **Google Generative AI Embeddings** - Vector representation of documents

### Utilities
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **ESM** - ECMAScript modules

---

## Project Structure

```
ChatDocs/
├── public/
│   └── index.html              # Frontend SPA with chat interface
├── src/
│   ├── config/
│   │   ├── chroma.js           # ChromaDB cloud client configuration
│   │   └── llm.js              # Google Generative AI LLM configuration
│   ├── RAG/
│   │   ├── data-ingestion.js   # PDF loading, chunking, and embedding
│   │   ├── data-retrieval.js   # Query embedding and vector search
│   │   └── data-generation.js  # LLM response generation with streaming
│   └── utils/
│       ├── upload.js           # Multer configuration for PDF uploads
│       └── convert-chat-history-to-langchain-chat.js  # Chat history conversion
├── uploads/                    # Temporary upload directory
├── server.js                   # Express server entry point
├── package.json                # Project dependencies
├── package-lock.json           # Locked dependency versions
├── .env.example                # Environment variable template
├── .gitignore                  # Git exclusion rules
├── LICENSE                     # MIT License
└── README.md                   # This file
```

### Key Directories

- **`public/`** - Static frontend assets. Contains the single-page application (SPA) with real-time chat UI
- **`src/config/`** - Configuration files for external services (ChromaDB and LLM)
- **`src/RAG/`** - Retrieval-Augmented Generation pipeline implementation
- **`src/utils/`** - Utility functions for file uploads and data transformation
- **`uploads/`** - Temporary storage for uploaded PDF files during processing

---

## Installation

### Prerequisites

- **Node.js** - v16+ (tested on Node 20+)
- **npm** - v8+
- **Google Cloud Account** - For Generative AI API access
- **ChromaDB Cloud Account** - For vector database
- **API Keys**:
  - Google Generative AI API key
  - ChromaDB API key and cloud credentials

### Clone Repository

```bash
git clone https://github.com/abdulrahman0842/ChatDocs.git
cd ChatDocs
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=5000

# Google Generative AI
GOOGLE_API_KEY=your_google_api_key_here

# ChromaDB Cloud
CHROMA_API_KEY=your_chromadb_api_key_here
CHROMA_TENANT=your_chroma_tenant_name
CHROMA_DATABASE=your_chroma_database_name
```

### Run Locally

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The application will start on `http://localhost:5000` (or the PORT specified in `.env`)

---

## Usage

### Upload a Document

1. Open the application in your browser
2. Use the **"Upload Reference PDF"** section in the sidebar (or drag-and-drop)
3. Select a PDF file (maximum 5MB)
4. Wait for the status message indicating successful indexing

### Chat with Your Document

1. Type your question in the input field at the bottom
2. Press Enter or click the send button
3. The AI will search the document and provide a context-aware response
4. Continue the conversation - the system maintains chat history for follow-up questions

### Example Queries

- "What is the main topic of this document?"
- "Can you summarize the key points?"
- "How do they detect local features like edges?" (follow-up question)
- "Explain the methodology used in this research"

---

## API Endpoints

### `GET /`
Serves the frontend SPA from `public/index.html`

### `POST /upload`
Uploads and processes a PDF file for ingestion

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `pdf` (file) - PDF file (max 5MB)

**Response:**
```json
{
  "msg": "file recieved",
  "file": {
    "name": "document.pdf"
  }
}
```

**Status Codes:**
- `200` - File uploaded and indexed successfully
- `400` - No file uploaded
- `413` - File size exceeds 5MB limit

### `POST /chat`
Sends a chat message and receives a streamed AI response

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "query": "Your question here",
  "chatHistory": [
    {
      "role": "user",
      "message": "Previous user message"
    },
    {
      "role": "assistant",
      "message": "Previous AI response"
    }
  ]
}
```

**Response:**
- Streams Server-Sent Events (SSE)
- Each event contains: `{"content": "response chunk"}`
- Final event: `[DONE]` (signifies end of stream)

**Status Codes:**
- `200` - Stream initiated successfully
- `500` - Internal server error during response generation

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `GOOGLE_API_KEY` | Google Generative AI API key | Yes |
| `CHROMA_API_KEY` | ChromaDB cloud API key | Yes |
| `CHROMA_TENANT` | ChromaDB tenant identifier | Yes |
| `CHROMA_DATABASE` | ChromaDB database name | Yes |

### LLM Configuration

**File:** `src/config/llm.js`
- **Model:** `gemini-2.5-flash`
- **Temperature:** `0.2` (more deterministic, less creative)
- **Max Output Tokens:** `1024`

### Vector Embedding Configuration

**File:** `src/config/data-ingestion.js`
- **Embedding Model:** `models/gemini-embedding-001`
- **Chunk Size:** `1000` characters
- **Chunk Overlap:** `200` characters

### File Upload Configuration

**File:** `src/utils/upload.js`
- **Max File Size:** `5 MB`
- **Allowed Format:** PDF only
- **Storage:** Memory storage with system temp directory

---

## Architecture

### Retrieval-Augmented Generation (RAG) Pipeline

The application implements a complete RAG workflow:

```
User Query
    ↓
[1. Query Condensation] → Context from chat history
    ↓
[2. Query Embedding] → Convert to vector representation
    ↓
[3. Vector Search] → Retrieve similar document chunks from ChromaDB
    ↓
[4. Context Augmentation] → Combine query with retrieved documents
    ↓
[5. LLM Generation] → Stream response grounded in context
    ↓
AI Response with citations
```

### Data Ingestion Pipeline

When a PDF is uploaded:

```
PDF File Upload
    ↓
[1. PDF Parsing] → Extract text using pdf-parse
    ↓
[2. Chunking] → Split into overlapping segments (1000 chars, 200 char overlap)
    ↓
[3. Embedding] → Generate vectors using Google Generative AI
    ↓
[4. Vector Storage] → Store in ChromaDB with metadata
    ↓
Ready for queries
```

### Chat History Management

- **Client-side Storage:** Chat history maintained in browser memory
- **Context Window:** Full history sent with each query
- **Query Condensation:** Multi-turn queries are rephrased using the LLM to resolve coreferences
- **Fallback:** If chat history is minimal, original query is used

### Streaming Response Architecture

- **SSE (Server-Sent Events):** Real-time token streaming from backend
- **Client Streaming:** Frontend receives and renders chunks as they arrive
- **Markdown Rendering:** Responses are parsed and displayed with markdown formatting

---

## Future Improvements

- [ ] **Multiple Document Support** - Manage and chat with multiple PDFs simultaneously
- [ ] **Document Metadata** - Track document source, upload date, and query history
- [ ] **Search Filters** - Filter results by document section or page number
- [ ] **Export Conversations** - Download chat history as PDF or markdown
- [ ] **User Authentication** - Support for user accounts and persistent chat history
- [ ] **Advanced RAG Techniques** - Implement query expansion, multi-hop reasoning, and re-ranking
- [ ] **Custom Models** - Support for alternative LLMs and embedding models
- [ ] **Web Scraping** - Add URLs as knowledge sources alongside PDFs
- [ ] **Batch Processing** - Queue and process multiple documents
- [ ] **Performance Analytics** - Track query latency, token usage, and costs
- [ ] **Mobile Responsiveness** - Optimize UI for tablet and mobile devices
- [ ] **Feedback Loop** - Rate response quality for model fine-tuning
- [ ] **RAG Evaluation Metrics** - Measure retrieval quality and response accuracy

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, descriptive commits
4. **Test your changes** - Ensure the application runs without errors
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Submit a Pull Request** with a detailed description of your changes

### Contribution Areas

- Bug fixes and error handling improvements
- UI/UX enhancements
- Performance optimizations
- Documentation improvements
- Additional RAG techniques and strategies
- Alternative model integrations

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

You are free to use, modify, and distribute this software, provided you include the original license and copyright notice. The software is provided "as is" without warranty.

---

## Support & Issues

- **Bug Reports:** Please open an issue on GitHub with a detailed description
- **Feature Requests:** Submit feature requests as GitHub issues
- **Documentation:** Check the README and inline code comments for guidance
- **Live Demo:** Test the application at [https://chat-docs-navy.vercel.app](https://chat-docs-navy.vercel.app)

---

## Author

**AR**

---

## Acknowledgments

- [LangChain](https://langchain.com) - LLM orchestration framework
- [Google Generative AI](https://ai.google.dev) - AI models and embeddings
- [ChromaDB](https://www.trychroma.com) - Vector database
- [Express.js](https://expressjs.com) - Web framework
- [TailwindCSS](https://tailwindcss.com) - UI styling

---

## Version

**v1.0.0** - Initial release with core RAG functionality
