# Apartment Search Application

An AI-powered apartment search application demonstrating Langchain with MCP integration in a NestJS TypeORM environment.

## 🚀 Features

- **Natural Language Search**: Describe your ideal apartment in plain English
- **AI Parameter Extraction**: Automatically extract search criteria from natural language
- **Smart Recommendations**: Get personalized apartment suggestions
- **Modern UI**: Responsive React frontend with Tailwind CSS
- **MCP Integration**: Extensible tool system for enhanced functionality

## 🏗️ Architecture

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **AI**: Langchain + OpenAI GPT + MCP
- **Database**: PostgreSQL with optimized indexing

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- OpenAI API key
- Python 3.8+ (for MCP servers)

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database and OpenAI API key
```

4. Set up the database:
```bash
# Create database
createdb apartment_search

# Run migrations (if using production setup)
npm run migration:run
```

5. Seed sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run start:dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your backend URL
```

4. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=apartment_search
NODE_ENV=development
PORT=3001
OPENAI_API_KEY=your-openai-api-key
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:3001
```

### MCP Servers

The application includes example MCP servers in the `backend/mcp-servers/` directory:

- `location-server.py`: Provides geocoding and location normalization
- Additional servers can be added for price analysis and amenity mapping

## 🎯 Usage

1. Open the application in your browser (http://localhost:5173)
2. Enter a natural language query like:
   - "2 bedroom apartment in Manhattan under $3000 with gym"
   - "Studio near Central Park with parking"
   - "Affordable 1BR in Brooklyn with amenities"
3. View search results and extracted parameters
4. Get AI-powered recommendations
5. Explore apartment details

## 📚 API Documentation

### Search Endpoints

**POST /api/search/apartments**
```json
{
  "query": "2 bedroom apartment in Manhattan under $3000",
  "user_id": "optional-user-id"
}
```

**GET /api/search/recommendations/:searchId**

**GET /api/search/history?userId=optional**

### Apartment Endpoints

**GET /api/apartments**
- Query parameters: min_price, max_price, bedrooms, room_type, location

**GET /api/apartments/:id**

**POST /api/apartments** (Admin)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Using Docker (Recommended)

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

### Manual Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

3. Deploy to your preferred hosting platform

## 🔍 Key Components

### Backend Services

- **LangchainService**: Handles AI parameter extraction
- **ApartmentService**: Manages apartment data operations
- **SearchService**: Orchestrates search workflow
- **RecommendationService**: Generates apartment recommendations

### Frontend Components

- **SearchForm**: Natural language input interface
- **SearchResults**: Displays search results and parameters
- **ApartmentCard**: Individual apartment display
- **RecommendationsSection**: AI-powered suggestions

### MCP Integration

- **Location Server**: Geocoding and location services
- **Price Analysis**: Market price validation
- **Amenity Mapping**: Standardizes amenity descriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Langchain](https://langchain.com/) for the AI framework
- [NestJS](https://nestjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend library
- [Shadcn/UI](https://ui.shadcn.com/) for the component library

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ using Langchain, MCP, NestJS, and React

