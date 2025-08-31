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
