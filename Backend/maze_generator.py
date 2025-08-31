import random
from typing import List, Tuple, Set

def generate_maze(width: int, height: int, start_pos: Tuple[int, int]) -> List[List[str]]:
    """
    Generate a maze using Prim's Maze Algorithm.
    
    Args:
        width: Width of the maze (odd number recommended)
        height: Height of the maze (odd number recommended)  
        start_pos: Starting position (row, col)
    
    Returns:
        2D grid representing the maze where '#' is wall and ' ' is path
    """
    # Initialize grid with all walls
    grid = [['#' for _ in range(width)] for _ in range(height)]
    
    # Directions: up, right, down, left
    directions = [(-2, 0), (0, 2), (2, 0), (0, -2)]
    
    # Mark cells as visited
    visited = set()
    
    # List of walls to consider
    walls = []
    
    def add_walls_to_list(row: int, col: int):
        """Add neighboring walls of a cell to the walls list"""
        for dr, dc in directions:
            wall_row = row + dr // 2
            wall_col = col + dc // 2
            neighbor_row = row + dr
            neighbor_col = col + dc
            
            # Check if the neighbor is within bounds
            if (0 <= neighbor_row < height and 0 <= neighbor_col < width and
                0 <= wall_row < height and 0 <= wall_col < width):
                # Only add wall if neighbor hasn't been visited
                if (neighbor_row, neighbor_col) not in visited:
                    walls.append((wall_row, wall_col, neighbor_row, neighbor_col))
    
    def is_valid_cell(row: int, col: int) -> bool:
        """Check if position is within bounds"""
        return 0 <= row < height and 0 <= col < width
    
    # Start with the given starting position
    start_row, start_col = start_pos
    grid[start_row][start_col] = ' '
    visited.add((start_row, start_col))
    add_walls_to_list(start_row, start_col)
    
    # Prim's algorithm main loop
    while walls:
        # Pick a random wall from the list
        wall_index = random.randint(0, len(walls) - 1)
        wall_row, wall_col, cell_row, cell_col = walls.pop(wall_index)
        
        # Check if the cell on the other side of the wall hasn't been visited
        if (cell_row, cell_col) not in visited and is_valid_cell(cell_row, cell_col):
            # Remove the wall (make it a path)
            grid[wall_row][wall_col] = ' '
            grid[cell_row][cell_col] = ' '
            
            # Mark the cell as visited
            visited.add((cell_row, cell_col))
            
            # Add the neighboring walls of the new cell to the list
            add_walls_to_list(cell_row, cell_col)
    
    return grid

def place_special_items(grid: List[List[str]], start_pos: Tuple[int, int], 
                       num_keys: int = 5, num_doors: int = 5, 
                       num_portals: int = 2) -> Tuple[dict, dict, dict, dict]:
    """
    Place keys, doors, books, and portals in the maze.
    Each door has a book behind it that can only be accessed with the matching key.
    
    Returns:
        keys_dict, doors_dict, books_dict, portals_dict
    """
    height, width = len(grid), len(grid[0])
    
    # Get all empty cells
    empty_cells = []
    for row in range(height):
        for col in range(width):
            if grid[row][col] == ' ' and (row, col) != start_pos:
                empty_cells.append((row, col))
    
    # Shuffle for random placement
    random.shuffle(empty_cells)
    
    # Place keys and doors with books
    keys = {}
    doors = {}
    books = {}
    colors = ['blue', 'orange', 'green', 'purple', 'red']
    
    for i in range(min(num_keys, len(colors), len(empty_cells) // 2)):
        color = colors[i]
        
        # Place key
        if empty_cells:
            keys[color] = empty_cells.pop()
        
        # Place door
        if empty_cells:
            door_pos = empty_cells.pop()
            doors[color] = door_pos
            # Place book behind the door (same position)
            books[color] = door_pos
    
    # Place portals
    portals = {}
    for i in range(0, min(num_portals * 2, len(empty_cells)), 2):
        if i + 1 < len(empty_cells):
            pos1 = empty_cells[i]
            pos2 = empty_cells[i + 1]
            portals[pos1] = pos2
            portals[pos2] = pos1
    
    return keys, doors, books, portals

def generate_complete_maze(width: int, height: int, start_pos: Tuple[int, int], 
                          maze_id: int, name: str) -> dict:
    """Generate a complete maze with all components"""
    # Ensure odd dimensions for proper maze generation
    if width % 2 == 0:
        width += 1
    if height % 2 == 0:
        height += 1
    
    # Generate the maze
    grid = generate_maze(width, height, start_pos)
    
    # Place special items
    keys, doors, books, portals = place_special_items(grid, start_pos)
    
    return {
        'maze_id': maze_id,
        'name': name,
        'grid': grid,
        'start_pos': start_pos,
        'keys': keys,
        'doors': doors,
        'books': books,
        'portals': portals
    }

if __name__ == "__main__":
    # Generate three mazes of different sizes
    random.seed(42)  # For consistent results
    
    # Beginner maze - 11x11
    maze1 = generate_complete_maze(11, 11, (1, 1), 1, "Beginner Maze")
    
    # Intermediate maze - 15x15  
    maze2 = generate_complete_maze(15, 15, (1, 1), 2, "Intermediate Maze")
    
    # Advanced maze - 19x19
    maze3 = generate_complete_maze(19, 19, (1, 1), 3, "Advanced Maze")
    
    # Print maze configurations
    for i, maze in enumerate([maze1, maze2, maze3], 1):
        print(f"\nMAZE_{i} = MazeConfig(")
        print(f"    maze_id={maze['maze_id']},")
        print(f"    name=\"{maze['name']}\",")
        print(f"    grid=[")
        for row in maze['grid']:
            print(f"        {row},")
        print(f"    ],")
        print(f"    start_pos={maze['start_pos']},")
        print(f"    keys={maze['keys']},")
        print(f"    doors={maze['doors']},")
        print(f"    books={maze['books']},")
        print(f"    portals={maze['portals']}")
        print(f")")