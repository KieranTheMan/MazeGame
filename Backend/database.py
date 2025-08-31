# Import Supabase client for database operations
from supabase import create_client, Client
# Import os for environment variable access
import os
# Import type hints for better code documentation
from typing import Optional
# Import dotenv for loading environment variables from .env file
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get Supabase URL from environment variables
url: str = os.environ.get("SUPABASE_URL")
# Get Supabase anonymous key from environment variables
key: str = os.environ.get("SUPABASE_ANON_KEY")
# Get Supabase service role key from environment variables (for admin operations)
service_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Validate that required environment variables are set
if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")

# Create Supabase client with anonymous key for regular operations
supabase: Client = create_client(url, key)
# Use service role key for admin operations if available, otherwise use anon key
admin_key = service_key if service_key else key
# Create admin Supabase client for operations that bypass Row Level Security (RLS)
admin_supabase: Client = create_client(url, admin_key)

# Function to retrieve user information by email address
def get_user_by_email(email: str):
    # Use admin client to bypass RLS for user authentication
    result = admin_supabase.table("users").select("*").eq("email", email).execute()
    # Return the first user found, or None if no user exists
    return result.data[0] if result.data else None

# Function to create a new user account
def create_user(username: str, email: str, hashed_password: str):
    # Use admin client for user creation to bypass RLS
    result = admin_supabase.table("users").insert({
        "username": username,           # User's chosen username
        "email": email,                # User's email address
        "password_hash": hashed_password # Hashed password for security
    }).execute()
    # Return the created user data, or None if creation failed
    return result.data[0] if result.data else None

# Function to retrieve all available mazes from the database
def get_mazes():
    # Query the mazes table and select all columns
    result = supabase.table("mazes").select("*").execute()
    # Return the list of maze data
    return result.data

# Function to save a game attempt to the database
def save_attempt(user_id: int, maze_id: int, moves: list, success: bool, collected_books: list = None):
    # Use admin client to bypass RLS for saving attempts
    # Set default value for collected_books if not provided
    if collected_books is None:
        collected_books = []
        
    # Insert attempt record into the attempts table
    result = admin_supabase.table("attempts").insert({
        "user_id": user_id,            # ID of the user who made the attempt
        "maze_id": maze_id,            # ID of the maze that was attempted
        "moves": moves,                # List of moves made during the attempt
        "success": success,            # Boolean indicating if the attempt was successful
        "collected_books": collected_books # List of books collected during the attempt
    }).execute()
    # Return the created attempt data, or None if creation failed
    return result.data[0] if result.data else None

# Function to retrieve leaderboard data for a specific maze
def get_leaderboard(maze_id: int):
    # Query attempts table with joins to get user information
    result = supabase.table("attempts").select(
        "users(username), moves, created_at"  # Select username from users table, moves and timestamp
    ).eq("maze_id", maze_id).eq("success", True).order("created_at").execute()
    # Filter for specific maze, only successful attempts, ordered by completion time
    return result.data