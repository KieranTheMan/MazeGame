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
        isPortal = true;    // Mark as portal if coordinates match
      }
    });
    
    return (
        <div  key={`${row}-${col}`} // React key for list rendering (unique per cell)
        className={`
          w-12 h-12 border border-gray-300 flex items-center justify-center text-xs font-bold
          ${isWall ? 'bg-amber-800' : 'bg-white'}    // Dark brown for walls, white for paths
          ${isPortal ? 'bg-purple-200' : ''}          // Light purple background for portals
        `}>
        {/* Render wall cells (empty content) */}
        {isWall && ""}
        {/* Render empty path cells with their original value */}
        {!isWall && !isPlayer && !keyColor && !doorColor && !bookColor && cellValue}
        
        {/* Render animated key if present */}
        {keyColor && (
          <motion.div
            animate={{ rotate: 360 }}   // Continuous 360-degree rotation animation
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`text-lg ${
              // Conditional styling based on key color
              keyColor === 'blue' ? 'text-blue-500' : 
              keyColor === 'orange' ? 'text-orange-500' :
              keyColor === 'green' ? 'text-green-500' :
              keyColor === 'purple' ? 'text-purple-500' :
              keyColor === 'red' ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            🗝️ {/* This emoji is RENDERED in the browser */}
          </motion.div>
        )}

        {/* Render door if present */}
        {doorColor && (
          <div className={`text-lg ${
            // Conditional styling based on door color (darker than keys)
            doorColor === 'blue' ? 'text-blue-600' : 
            doorColor === 'orange' ? 'text-orange-600' :
            doorColor === 'green' ? 'text-green-600' :
            doorColor === 'purple' ? 'text-purple-600' :
            doorColor === 'red' ? 'text-red-600' : 'text-gray-600'
          }`}>
            🚪
          </div>
        )}

         {/* Render animated book if present */}
        {bookColor && (
          <motion.div
            initial={{ scale: 0.8 }}   // Start at 80% size
            animate={{ scale: [0.8, 1.1, 1] }}  // Pulse animation: small -> large -> normal
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className={`text-lg ${
              // Conditional styling based on book color (darkest of the three)
              bookColor === 'blue' ? 'text-blue-700' : 
              bookColor === 'orange' ? 'text-orange-700' :
              bookColor === 'green' ? 'text-green-700' :
              bookColor === 'purple' ? 'text-purple-700' :
              bookColor === 'red' ? 'text-red-700' : 'text-gray-700'
            }`}
          >
            📚
          </motion.div>
        )}





        </div>
    );
    }

    // Render the grid as a table of cells
    return (
      <div className="maze-grid">
        {grid.map((rowArr, rowIdx) => (
          <div key={rowIdx} className="flex">
            {rowArr.map((cell, colIdx) => renderCell(cell, rowIdx, colIdx))}
          </div>
        ))}
      </div>
    );
}