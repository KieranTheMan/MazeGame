// Import React hooks for state management and side effects
import React, { useState, useEffect, useCallback } from 'react';
// Import animation components from framer-motion for smooth transitions
import { motion, AnimatePresence } from 'framer-motion';
// Import custom components for the game interface
import MazeGrid from './MazeGrid';
import MoveInput from './MoveInput';
import Leaderboard from './Leaderboard';

// TypeScript interface defining the structure of a maze object
interface Maze {
  maze_id: number;                    // Unique identifier for the maze
  name: string;                       // Display name of the maze
  grid: string[][];                   // 2D array representing the maze layout
  start_pos: [number, number];        // Starting position coordinates [row, col]
  keys: { [color: string]: [number, number] };      // Map of key colors to their positions
  doors: { [color: string]: [number, number] };     // Map of door colors to their positions
  books: { [color: string]: [number, number] };     // Map of book colors to their positions
  portals: { [key: string]: [number, number] };     // Map of portal identifiers to their positions
}

// TypeScript interface defining the props passed to GameBoard component
interface GameBoardProps {
  token: string;                      // Authentication token for API requests
  onLogout: () => void;               // Callback function to handle logout
}

// Main GameBoard component that manages the maze puzzle game
const GameBoard: React.FC<GameBoardProps> = ({ token, onLogout }) => {
  // State management using React hooks
  
  // Array of all available mazes fetched from the server
  const [mazes, setMazes] = useState<Maze[]>([]);
  // Currently selected maze (null when no maze is selected)
  const [selectedMaze, setSelectedMaze] = useState<Maze | null>(null);
  // Current player position as [row, col] coordinates
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  // Array of key colors that the player has collected
  const [collectedKeys, setCollectedKeys] = useState<string[]>([]);
  // Array of book colors that the player has collected
  const [collectedBooks, setCollectedBooks] = useState<string[]>([]);
  // Boolean flag indicating if the player has won the game
  const [gameWon, setGameWon] = useState(false);
  // Array of previous moves made by the player
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  // Boolean flag indicating if a move request is in progress
  const [loading, setLoading] = useState(false);
  // Boolean flag controlling the visibility of result modal
  const [showResult, setShowResult] = useState(false);
  // String message to display in the result modal
  const [resultMessage, setResultMessage] = useState('');

  // Async function to fetch available mazes from the server
  const fetchMazes = useCallback(async () => {
    try {
      // Make HTTP GET request to the mazes endpoint with authentication
      const response = await fetch('https://mazegame-ygme.onrender.com/mazes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Parse the JSON response from the server
      const data = await response.json();
      // Update the mazes state with the fetched data
      setMazes(data.mazes);
    } catch (error) {
      // Log any errors that occur during the fetch operation
      console.error('Failed to fetch mazes:', error);
    }
  }, [token]); // Dependency array ensures function is recreated when token changes

  // Effect hook to fetch mazes when the component mounts or fetchMazes changes
  useEffect(() => {
    fetchMazes();
  }, [fetchMazes]);

  // Function to handle maze selection and reset game state
  const selectMaze = (maze: Maze) => {
    setSelectedMaze(maze);             // Set the selected maze
    setPlayerPos(maze.start_pos);     // Reset player to maze start position
    setCollectedKeys([]);             // Clear collected keys
    setCollectedBooks([]);            // Clear collected books
    setGameWon(false);                // Reset win status
    setMoveHistory([]);               // Clear move history
    setShowResult(false);             // Hide any result modal
  };

  // Async function to submit a player move to the server
  const submitMove = async (direction: string, steps: number) => {
    // Early return if no maze is selected
    if (!selectedMaze) return;
    
    setLoading(true);                 // Set loading state to show spinner/disable inputs
    try {
      // Make HTTP POST request to submit the move
      const response = await fetch('https://mazegame-ygme.onrender.com/moves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          direction,                   // Direction of movement (e.g., "up", "down", "left", "right")
          steps,                      // Number of steps to move
          maze_id: selectedMaze.maze_id // ID of the current maze
        })
      });

      // Parse the server response
      const result = await response.json();
      
      // Check if the move was valid
      if (result.valid) {
        setPlayerPos(result.new_position);                    // Update player position
        setCollectedKeys(result.collected_keys);              // Update collected keys
        setCollectedBooks(result.collected_books || []);      // Update collected books (with fallback)
        setMoveHistory([...moveHistory, { direction, steps }]); // Add move to history
        
        // Check if the player has won the game
        if (result.won) {
          setGameWon(true);                                   // Set win flag
          setResultMessage('Congratulations! You collected all 5 books and won the game! 🎉');
          setShowResult(true);                               // Show victory modal
        }
      } else {
        // Handle invalid move
        setResultMessage(`Invalid move: ${result.error}`);
        setShowResult(true);                                 // Show error modal
      }
    } catch (error) {
      // Handle network or other errors
      setResultMessage('Network error. Please try again.');
      setShowResult(true);                                   // Show error modal
    } finally {
      setLoading(false);                                     // Always reset loading state
    }
  };

  // Render maze selection screen when no maze is currently selected
  if (!selectedMaze) {
    return (
      // Main container with full height and gray background
      <div className="min-h-screen bg-gray-100 p-8">
        {/* Centered container with max width */}
        <div className="max-w-4xl mx-auto">
          {/* Header with title and logout button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Maze Puzzle Game</h1>
            <button
              onClick={onLogout}                              // Call logout function when clicked
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          
          {/* Grid layout for displaying available mazes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Map through each maze and create a clickable card */}
            {mazes.map((maze) => (
              <div
                key={maze.maze_id}                            // React key for list rendering
                onClick={() => selectMaze(maze)}              // Select maze when clicked
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{maze.name}</h3>
                <p className="text-gray-600">Click to start playing</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render the main game interface when a maze is selected
  return (
    // Main container with full height and gray background
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Centered container with max width */}
      <div className="max-w-6xl mx-auto">
        {/* Header with back button, maze name, and logout button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => setSelectedMaze(null)}           // Return to maze selection
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Back to Maze Selection
            </button>
            <h1 className="text-3xl font-bold">{selectedMaze.name}</h1>
          </div>
          <button
            onClick={onLogout}                                // Call logout function
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        {/* Main game layout with maze grid and sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Maze grid takes up 2/3 of the width on large screens */}
          <div className="lg:col-span-2 flex justify-center">
            <MazeGrid
              grid={selectedMaze.grid}                       // Pass maze layout
              playerPos={playerPos}                           // Pass current player position
              keys={selectedMaze.keys}                        // Pass key positions
              doors={selectedMaze.doors}                      // Pass door positions
              books={selectedMaze.books}                      // Pass book positions
              collectedKeys={collectedKeys}                    // Pass collected keys
              collectedBooks={collectedBooks}                  // Pass collected books
              portals={selectedMaze.portals}                  // Pass portal positions
            />
          </div>
          
          {/* Sidebar with game controls and status */}
          <div className="space-y-6">
            {/* Move input component for player controls */}
            <MoveInput
              onSubmitMove={submitMove}                       // Pass move submission function
              disabled={loading || gameWon}                   // Disable when loading or game won
            />
            
            {/* Keys collected display */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Keys Collected</h3>
              <div className="flex flex-wrap gap-2">
                {/* Map through collected keys and display colored badges */}
                {collectedKeys.map(color => (
                  <div
                    key={color}                               // React key for list rendering
                    className={`px-3 py-1 rounded-full text-sm ${
                      // Conditional styling based on key color
                      color === 'blue' ? 'bg-blue-100 text-blue-800' : 
                      color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      color === 'green' ? 'bg-green-100 text-green-800' :
                      color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      color === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {color} key 🗝️
                  </div>
                ))}
                {/* Show "None" message when no keys are collected */}
                {collectedKeys.length === 0 && (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
            
            {/* Books collected display with progress indicator */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Books Collected ({collectedBooks.length}/5)</h3>
              <div className="flex flex-wrap gap-2">
                {/* Map through collected books and display colored badges */}
                {collectedBooks.map(color => (
                  <div
                    key={color}                               // React key for list rendering
                    className={`px-3 py-1 rounded-full text-sm ${
                      // Conditional styling based on book color (same as keys)
                      color === 'blue' ? 'bg-blue-100 text-blue-800' : 
                      color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      color === 'green' ? 'bg-green-100 text-green-800' :
                      color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      color === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {color} book 📚
                  </div>
                ))}
                {/* Show "None" message when no books are collected */}
                {collectedBooks.length === 0 && (
                  <span className="text-gray-500">None</span>
                )}
                {/* Show victory message when all 5 books are collected */}
                {collectedBooks.length === 5 && (
                  <div className="text-green-600 font-bold">🎉 All books collected!</div>
                )}
              </div>
            </div>
            
            {/* Move history display */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Move History</h3>
              {/* Scrollable container with max height */}
              <div className="max-h-32 overflow-y-auto">
                {/* Map through move history and display each move */}
                {moveHistory.map((move, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {index + 1}. {move.direction} {move.steps} steps
                  </div>
                ))}
                {/* Show "No moves yet" when history is empty */}
                {moveHistory.length === 0 && (
                  <span className="text-gray-500">No moves yet</span>
                )}
              </div>
            </div>
            
            {/* Leaderboard component */}
            <Leaderboard mazeId={selectedMaze.maze_id} token={token} />
          </div>
        </div>
        
        {/* Animated modal for displaying game results */}
        <AnimatePresence>
          {/* Only render modal when showResult is true */}
          {showResult && (
            // Overlay background with click-to-close functionality
            <motion.div
              initial={{ opacity: 0 }}                        // Start transparent
              animate={{ opacity: 1 }}                         // Fade in
              exit={{ opacity: 0 }}                            // Fade out when closing
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={() => setShowResult(false)}             // Close modal when overlay is clicked
            >
              {/* Modal content container */}
              <motion.div
                initial={{ scale: 0.8 }}                      // Start smaller
                animate={{ scale: 1 }}                         // Scale to full size
                exit={{ scale: 0.8 }}                          // Scale down when closing
                className="bg-white p-8 rounded-lg max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}          // Prevent closing when modal content is clicked
              >
                {/* Modal title based on game state */}
                <h2 className="text-2xl font-bold mb-4">
                  {gameWon ? '🎉 Victory!' : '❌ Invalid Move'}
                </h2>
                {/* Modal message content */}
                <p className="text-gray-700 mb-6">{resultMessage}</p>
                {/* Close button */}
                <button
                  onClick={() => setShowResult(false)}        // Close modal when clicked
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Export the GameBoard component as the default export
export default GameBoard;