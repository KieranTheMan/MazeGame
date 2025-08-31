# Import FastAPI components for web framework functionality
from fastapi import FastAPI, HTTPException, Depends, status
# Import security components for JWT token authentication
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# Import CORS middleware for cross-origin requests
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and serialization
from pydantic import BaseModel
# Import type hints for better code documentation
from typing import Optional, List, Tuple
# Import timedelta for token expiration calculations
from datetime import timedelta
# Import os for environment variable access
import os
# Import dotenv for loading environment variables from .env file
from dotenv import load_dotenv

# Import custom modules for authentication, database, and game logic
from auth import create_access_token, verify_password, get_password_hash, verify_token
from database import get_user_by_email, create_user, get_mazes, save_attempt
from mazes import MAZES, validate_move

# Load environment variables from .env file
load_dotenv()

# Create FastAPI application instance with title for API documentation
app = FastAPI(title="Maze Puzzle Game API")

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mazepuzzlegame.onrender.com/"],  # Allowed frontend origins
    allow_credentials=True,                                           # Allow credentials (cookies, auth headers)
    allow_methods=["*"],                                             # Allow all HTTP methods
    allow_headers=["*"],                                             # Allow all headers
)

# Create HTTPBearer instance for JWT token authentication
security = HTTPBearer()

# Pydantic model for user registration data validation
class UserSignup(BaseModel):
    username: str    # User's chosen username
    email: str       # User's email address
    password: str    # User's password (will be hashed)

# Pydantic model for user login data validation
class UserLogin(BaseModel):
    email: str       # User's email address
    password: str    # User's password

# Pydantic model for move submission data validation
class MoveSubmission(BaseModel):
    direction: str   # Direction of movement (up, down, left, right)
    steps: int       # Number of steps to move
    maze_id: int     # ID of the maze being played

# Pydantic model for game state data structure
class GameState(BaseModel):
    position: Tuple[int, int]     # Current player position [row, col]
    collected_keys: List[str]     # List of collected key colors
    collected_books: List[str] = [] # List of collected book colors (default empty)

# Root endpoint - simple health check and API identification
@app.get("/")
async def root():
    return {"message": "Maze Puzzle Game API"}

# User registration endpoint
@app.post("/auth/signup")
async def signup(user: UserSignup):
    # Check if user with this email already exists
    existing_user = get_user_by_email(user.email)
    if existing_user:
        # Return 400 error if email is already registered
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password for secure storage
    hashed_password = get_password_hash(user.password)
    # Create new user in database
    new_user = create_user(user.username, user.email, hashed_password)
    
    # Check if user creation was successful
    if not new_user:
        # Return 500 error if user creation failed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    # Return success message
    return {"message": "User created successfully"}

# User login endpoint
@app.post("/auth/login")
async def login(user: UserLogin):
    # Get user from database by email
    db_user = get_user_by_email(user.email)
    # Check if user exists and password is correct
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        # Return 401 error if credentials are invalid
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Set token expiration time (30 minutes)
    access_token_expires = timedelta(minutes=30)
    # Create JWT access token with user email as subject
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    # Return token and type for frontend authentication
    return {"access_token": access_token, "token_type": "bearer"}

# Get available mazes endpoint
@app.get("/mazes")
async def get_mazes():
    maze_list = []
    # Iterate through all available mazes
    for maze in MAZES.values():
        # Convert maze data to frontend-friendly format
        maze_list.append({
            "maze_id": maze.maze_id,                    # Unique maze identifier
            "name": maze.name,                          # Display name
            "grid": maze.grid,                          # 2D array of maze layout
            "start_pos": maze.start_pos,                # Starting position [row, col]
            "keys": maze.keys,                          # Key positions by color
            "doors": maze.doors,                        # Door positions by color
            "books": maze.books,                        # Book positions by color
            "portals": {f"{k[0]},{k[1]}": v for k, v in maze.portals.items()}  # Portal positions
        })
    return {"mazes": maze_list}

# In-memory storage for game states (in production, this should be in a database)
game_states = {}

# Submit move endpoint - requires authentication
@app.post("/moves")
async def submit_move(move: MoveSubmission, credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Verify JWT token and extract user email
    email = verify_token(credentials.credentials)
    # Get user from database
    user = get_user_by_email(email)
    
    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Get user ID and create unique game key
    user_id = user["id"]
    game_key = f"{user_id}_{move.maze_id}"
    
    # Initialize game state if it doesn't exist
    if game_key not in game_states:
        maze = MAZES.get(move.maze_id)
        if not maze:
            raise HTTPException(status_code=404, detail="Maze not found")
        # Create new game state with starting position and empty collections
        game_states[game_key] = {
            "position": maze.start_pos,
            "collected_keys": [],
            "collected_books": []
        }
    
    # Get current game state
    current_state = game_states[game_key]
    # Validate the move and get result
    result = validate_move(
        move.maze_id,
        current_state["position"],
        move.direction,
        move.steps,
        current_state["collected_keys"],
        current_state["collected_books"]
    )
    
    # If move is valid, update game state
    if result["valid"]:
        # Update position and collections
        game_states[game_key]["position"] = result["new_position"]
        game_states[game_key]["collected_keys"] = result["collected_keys"]
        game_states[game_key]["collected_books"] = result["collected_books"]
        
        # Save the move attempt to database
        save_attempt(user_id, move.maze_id, [move.direction, move.steps], result["won"], result["collected_books"])
        
        # If game is won, clear the game state from memory
        if result["won"]:
            del game_states[game_key]
    
    # Return the move result to frontend
    return result

# Get leaderboard endpoint
@app.get("/leaderboard/{maze_id}")
async def get_leaderboard(maze_id: int):
    # Import here to avoid circular imports
    from database import get_leaderboard
    # Get leaderboard data from database
    leaderboard = get_leaderboard(maze_id)
    return {"leaderboard": leaderboard}

# Entry point for running the application
if __name__ == "__main__":
    import uvicorn
    # Start the FastAPI server on all interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)