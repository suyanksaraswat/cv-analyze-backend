## 📁 Project Structure

```
cv-analyze-backend/
├── src/
│   ├── controllers/       # Handles API logic (e.g., parsing, scoring)
│   ├── services/          # Business logic (e.g., resume analysis, NLP)
│   ├── routes/            # Defines Express routes
│   ├── utils/             # Utility modules (e.g., file handling, parsing)
│   └── index.js           # Main entry point, sets up Express app
├── config/
│   └── default.js         # Configuration values (API keys, constants)
├── tests/                 # Unit and integration tests
├── .env.example           # Example environment config
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```


---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: JavaScript (ES6+)
- **File Handling**: `multer`
- **Document Parsing**: Likely `pdf-parse`, `docx`, or similar
- **Natural Language Processing (NLP)**: Possibly `natural`, `compromise`, or custom logic
- **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)
- **Environment Management**: `dotenv`
- **Linting**: ESLint / Prettier

---

## 🚀 Getting Started

```bash
# Install dependencies
yarn

# Run the development server
npm run dev

# Run tests
npm test
