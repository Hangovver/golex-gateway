"""
GOLEX Backend - FastAPI Main Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="GOLEX Backend API",
    description="Football predictions + betting intelligence",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "GOLEX Backend",
        "version": "1.0.0",
        "database": "Supabase PostgreSQL",
        "storage": "Cloudflare R2"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "supabase": "configured",
        "r2_storage": "configured"
    }

@app.get("/api/v1/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {"message": "GOLEX Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
