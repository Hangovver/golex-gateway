"""
GOLEX Backend - Configuration
Environment variables and settings
"""

import os
from typing import Optional

# ==========================================
# SUPABASE CONFIGURATION
# ==========================================
SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")

# ==========================================
# CLOUDFLARE R2 STORAGE
# ==========================================
R2_ACCOUNT_ID: Optional[str] = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID: Optional[str] = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY: Optional[str] = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME: str = os.getenv("R2_BUCKET_NAME", "golex-images")
R2_ENDPOINT: Optional[str] = os.getenv("R2_ENDPOINT")

# ==========================================
# API-FOOTBALL (Optional)
# ==========================================
API_FOOTBALL_KEY: Optional[str] = os.getenv("API_FOOTBALL_KEY")
API_FOOTBALL_URL: str = os.getenv("API_FOOTBALL_URL", "https://v3.football.api-sports.io")

# ==========================================
# APPLICATION SETTINGS
# ==========================================
ENV: str = os.getenv("ENV", "production")
DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
PORT: int = int(os.getenv("PORT", 8000))

# ==========================================
# VALIDATION
# ==========================================
def validate_config():
    """Validate required environment variables"""
    required = {
        "SUPABASE_URL": SUPABASE_URL,
        "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_SERVICE_ROLE_KEY,
        "DATABASE_URL": DATABASE_URL,
        "R2_ACCOUNT_ID": R2_ACCOUNT_ID,
        "R2_ACCESS_KEY_ID": R2_ACCESS_KEY_ID,
        "R2_SECRET_ACCESS_KEY": R2_SECRET_ACCESS_KEY,
    }
    
    missing = [key for key, value in required.items() if not value]
    
    if missing:
        print(f"⚠️ Missing environment variables: {', '.join(missing)}")
        return False
    
    print("✅ All required environment variables are set!")
    return True

if __name__ == "__main__":
    validate_config()
