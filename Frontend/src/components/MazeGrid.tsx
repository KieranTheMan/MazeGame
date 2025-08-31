import React from 'react';
import { motion } from 'framer-motion'

interface MazeGridProps {
    grid: string[][];                     // 2D array representing the maze layout (walls, paths, etc.)
    playerPos: [number, number];         // Current player position as [row, col] coordinates
    keys: { [color: string]: [number, number] };      // Map of key colors to their positions
    doors: { [color: string]: [number, number] };     // Map of door colors to their positions
    books: { [color: string]: [number, number] };     // Map of book colors to their positions
    collectedKeys: string[];             // Array of key colors that the player has collected
    collectedBooks: string[];           // Array of book colors that the player has collected
    portals: { [key: string]: [number, number] }; // Map of portal identifiers to their positions
}

// Main MazeGrid component that renders the visual representation of the maze
const MazeGrid: React.FC<MazeGridProps> = ({
  grid,                               // Destructure props for easier access
  playerPos,
  keys,
  doors,
  books,
  collectedKeys,
  collectedBooks,
  portals
}) => {

    // Function to render individual cells in the maze grid
  const renderCell = (cellValue: string, row: number, col: number) => {
    // Check if the current cell is a wall (represented by "#")
    const isWall = cellValue === "#";
    // Check if the current cell contains the player
    const isPlayer = playerPos[0] === row && playerPos[1] === col;
    
    // Variables to track what items are in this cell
    let keyColor: string | null = null;              // Color of key in this cell (if any)
    let doorColor: string | null = null;             // Color of door in this cell (if any)
    let bookColor: string | null = null;             // Color of book in this cell (if any)
    let isPortal = false;             // Whether this cell is a portal
  

   // Check if there's an uncollected key at this position
    Object.entries(keys).forEach(([color, [keyRow, keyCol]]) => {
      if (keyRow === row && keyCol === col && !collectedKeys.includes(color)) {
        keyColor = color;              // Set the key color if found and not collected
      }
    });
    
    // Check if there's a locked door at this position
    Object.entries(doors).forEach(([color, [doorRow, doorCol]]) => {
      if (doorRow === row && doorCol === col && !collectedKeys.includes(color)) {
        doorColor = color;             // Set the door color if found and key not collected
      }
    });

     // Check if there's a collectible book at this position
    Object.entries(books).forEach(([color, [bookRow, bookCol]]) => {
      if (bookRow === row && bookCol === col && collectedKeys.includes(color) && !collectedBooks.includes(color)) {
        bookColor = color;             // Set the book color if key is collected but book is not
      }
    });
    
    // Check if this cell is a portal entrance
    Object.entries(portals).forEach(([portalKey, [portalRow, portalCol]]) => {
      // Parse the portal key to get the entrance coordinates
      const [fromRow, fromCol] = portalKey.split(',').map(Number);
      if (fromRow === row && fromCol === col) {
        isPortal = true;               // Mark as portal if coordinates match
      }
    });
    

  }
    
    
    // TODO: Implement the rendering logic for the maze grid here
    return (
        <div>
            {/* Maze grid rendering will go here */}
        </div>
    );
}