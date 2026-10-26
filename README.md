# PlantSense – AI Plant Detector

A production-ready web application for scanning and identifying plant species using AI, including care guides and historic scans logging.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, React Router v6, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Multer (multipart uploads).
- **Services**: Supabase (Database & Auth), Cloudinary (Image Hosting), Gemini API (AI Identification Engine).

## Directory Structure
- `/client`: Front-end React Vite client.
- `/server`: Back-end Express API.

## Getting Started

### 1. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your credentials in the .env file
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```
