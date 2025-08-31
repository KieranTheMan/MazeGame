# Import type hints for better code documentation
from typing import List, Dict, Tuple

# Class to represent a maze configuration with all its properties
class MazeConfig:
    def __init__(self, maze_id: int, name: str, grid: List[List[str]], 
                 start_pos: Tuple[int, int],
                 keys: Dict[str, Tuple[int, int]], doors: Dict[str, Tuple[int, int]],
                 books: Dict[str, Tuple[int, int]],
                 portals: Dict[Tuple[int, int], Tuple[int, int]]):
        self.maze_id = maze_id                    # Unique identifier for the maze
        self.name = name                          # Display name of the maze
        self.grid = grid                          # 2D array representing the maze layout
        self.start_pos = start_pos                # Starting position [row, col] for the player
        self.keys = keys                          # Dictionary mapping key colors to their positions
        self.doors = doors                        # Dictionary mapping door colors to their positions
        self.books = books                        # Dictionary mapping book colors to their positions
        self.portals = portals                    # Dictionary mapping portal entrances to exits

# First maze configuration - Beginner level
MAZE_1 = MazeConfig(
    maze_id=1,                                    # Unique ID for this maze
    name="Beginner Maze",                         # Display name
    grid=[                                        # 2D grid where '#' = wall, ' ' = path
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#'],
        ['#', ' ', '#', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    start_pos=(1, 1),                             # Player starts at row 1, column 1
    keys={"blue": (1, 8), "orange": (5, 5), "green": (5, 3), "purple": (8, 3), "red": (1, 4)},
    # Keys are located at specific positions, each with a color
    doors={"blue": (1, 7), "orange": (9, 9), "green": (9, 5), "purple": (3, 9), "red": (6, 5)},
    # Doors block paths and require matching colored keys to pass
    books={"blue": (1, 7), "orange": (9, 9), "green": (9, 5), "purple": (3, 9), "red": (6, 5)},
    # Books are collectible items that appear after doors are unlocked
    portals={(9, 6): (1, 2), (1, 2): (9, 6), (3, 7): (4, 7), (4, 7): (3, 7)}
    # Portals create teleportation between two positions
)

# Second maze configuration - Intermediate level
MAZE_2 = MazeConfig(
    maze_id=2,                                    # Unique ID for this maze
    name="Intermediate Maze",                     # Display name
    grid=[                                        # Larger 15x15 grid for increased difficulty
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', '#', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', '#', '#', '#', '#', '#', '#', '#', '#', ' ', '#', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
        ['#', '#', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', '#', '#', '#', '#', ' ', '#', '#', '#'],
        ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#', ' ', '#'],
        ['#', '#', '#', ' ', '#', ' ', '#', '#', '#', '#', '#', ' ', '#', ' ', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', '#', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#'],
        ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    start_pos=(1, 1),                             # Player starts at row 1, column 1
    keys={"blue": (7, 5), "orange": (5, 4), "green": (13, 11), "purple": (2, 1), "red": (9, 9)},
    # Keys scattered throughout the larger maze
    doors={"blue": (6, 3), "orange": (1, 11), "green": (11, 4), "purple": (13, 6), "red": (1, 12)},
    # Doors positioned to create strategic challenges
    books={"blue": (6, 3), "orange": (1, 11), "green": (11, 4), "purple": (13, 6), "red": (1, 12)},
    # Books appear at door locations after keys are collected
    portals={(8, 3): (1, 9), (1, 9): (8, 3), (13, 13): (9, 1), (9, 1): (13, 13)}
    # Bidirectional portals for strategic movement
)

# Third maze configuration - Advanced level
MAZE_3 = MazeConfig(
    maze_id=3,                                    # Unique ID for this maze
    name="Advanced Maze",                         # Display name
    grid=[                                        # Largest 19x19 grid for maximum difficulty
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#'],
        ['#', '#', '#', ' ', '#', '#', '#', '#', '#', '#', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', ' ', '#', '#', '#', '#', '#', '#', '#', '#', '#', ' ', '#'],
        ['#', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', '#', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', '#', '#', ' ', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', '#', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', '#', '#', '#', '#'],
        ['#', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#'],
        ['#', '#', '#', '#', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', '#', '#'],
        ['#', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#', ' ', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    start_pos=(1, 1),                             # Player starts at row 1, column 1
    keys={"blue": (10, 17), "orange": (15, 17), "green": (13, 3), "purple": (1, 14), "red": (10, 15)},
    # Keys positioned in challenging locations
    doors={"blue": (17, 1), "orange": (5, 3), "green": (4, 1), "purple": (9, 6), "red": (17, 7)},
    # Doors create complex routing challenges
    books={"blue": (17, 1), "orange": (5, 3), "green": (4, 1), "purple": (9, 6), "red": (17, 7)},
    # Books appear at door locations after keys are collected
    portals={(1, 3): (8, 3), (8, 3): (1, 3), (5, 16): (15, 13), (15, 13): (5, 16)}
    # Strategic portal placement for advanced navigation
)

# Dictionary mapping maze IDs to their configurations
MAZES = {
    1: MAZE_1,                                    # Map ID 1 to beginner maze
    2: MAZE_2,                                    # Map ID 2 to intermediate maze
    3: MAZE_3                                     # Map ID 3 to advanced maze
}

# Function to retrieve a maze configuration by ID
def get_maze(maze_id: int) -> MazeConfig:
    return MAZES.get(maze_id)                     # Return maze config or None if not found

# Function to validate a player move and return the result
def validate_move(maze_id: int, current_pos: Tuple[int, int], direction: str, steps: int, 
                  collected_keys: List[str], collected_books: List[str] = None) -> Dict:
    # Get the maze configuration
    maze = get_maze(maze_id)
    if not maze:
        return {"valid": False, "error": "Invalid maze ID"}
    
    # Initialize collected_books if not provided
    if collected_books is None:
        collected_books = []
    
    # Extract current position coordinates
    row, col = current_pos
    
    # Map direction strings to coordinate changes
    direction_map = {
        "up": (-1, 0),                            # Move up decreases row
        "down": (1, 0),                           # Move down increases row
        "left": (0, -1),                          # Move left decreases column
        "right": (0, 1)                           # Move right increases column
    }
    
    # Validate direction is valid
    if direction not in direction_map:
        return {"valid": False, "error": "Invalid direction"}
    
    # Get direction vector and initialize new position
    dr, dc = direction_map[direction]
    new_row, new_col = row, col
    
    # Process each step of the move
    for step in range(steps):
        new_row += dr  # Update row position
        new_col += dc  # Update column position
        
        # Check for wall collision or boundary violation
        if (new_row < 0 or new_row >= len(maze.grid) or 
            new_col < 0 or new_col >= len(maze.grid[0]) or
            maze.grid[new_row][new_col] == "#"):
            return {"valid": False, "error": "Hit wall or boundary"}
        
        # Check for locked doors
        for color, door_pos in maze.doors.items():
            if (new_row, new_col) == door_pos and color not in collected_keys:
                return {"valid": False, "error": f"Need {color} key to pass"}
    
    # Set final position after all steps
    final_pos = (new_row, new_col)
    
    # Check for portal teleportation
    if final_pos in maze.portals:
        final_pos = maze.portals[final_pos]       # Teleport to portal destination
    
    # Check for key collection
    new_keys = collected_keys.copy()              # Create copy to avoid modifying original
    for color, key_pos in maze.keys.items():
        if final_pos == key_pos and color not in new_keys:
            new_keys.append(color)                # Add newly collected key
    
    # Check for book collection (only if corresponding key is owned)
    new_books = collected_books.copy()            # Create copy to avoid modifying original
    for color, book_pos in maze.books.items():
        if final_pos == book_pos and color in new_keys and color not in new_books:
            new_books.append(color)               # Add newly collected book
    
    # Win condition: collect all 5 books
    won = len(new_books) == 5
    
    # Return move validation result
    return {
        "valid": True,                            # Move was successful
        "new_position": final_pos,                # Updated player position
        "collected_keys": new_keys,               # Updated key collection
        "collected_books": new_books,             # Updated book collection
        "won": won                                # Whether the game is won
    }