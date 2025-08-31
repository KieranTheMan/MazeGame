# Import datetime and timedelta for token expiration calculations
from datetime import datetime, timedelta
# Import type hints for better code documentation
from typing import Optional
# Import JWT library for encoding and decoding JSON Web Tokens
from jose import JWTError, jwt
# Import password hashing context for secure password operations
from passlib.context import CryptContext
# Import FastAPI components for HTTP exceptions and status codes
from fastapi import HTTPException, status
# Import os for environment variable access
import os

# Get secret key from environment variables, with fallback for development
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
# JWT algorithm used for signing and verifying tokens
ALGORITHM = "HS256"
# Default token expiration time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create password hashing context using bcrypt algorithm
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to verify a plain text password against a hashed password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Use bcrypt to verify the password matches the hash
    return pwd_context.verify(plain_password, hashed_password)

# Function to hash a plain text password for secure storage
def get_password_hash(password: str) -> str:
    # Use bcrypt to create a secure hash of the password
    return pwd_context.hash(password)

# Function to create a JWT access token with optional expiration time
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    # Create a copy of the data to avoid modifying the original
    to_encode = data.copy()
    # Set expiration time based on provided delta or default
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    # Add expiration time to the token payload
    to_encode.update({"exp": expire})
    # Encode the JWT token with the secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # Return the encoded JWT token
    return encoded_jwt

# Function to verify and decode a JWT token
def verify_token(token: str):
    # Create exception for invalid credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Extract the email (subject) from the token payload
        email: str = payload.get("sub")
        # Check if email exists in the payload
        if email is None:
            raise credentials_exception
        # Return the email if token is valid
        return email
    except JWTError:
        # Raise exception if token is invalid or expired
        raise credentials_exception