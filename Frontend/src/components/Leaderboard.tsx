// Import React hooks for state management, side effects, and memoized functions
import React, { useState, useEffect, useCallback } from "react";

// TypeScript interface defining the structure of a leaderboard entry
interface LeaderboardEntry {
  users: { username: string }; // User information object containing username
  moves: any[]; // Array of moves made by the user in the game
  created_at: string; // Timestamp when the game was completed
}

// TypeScript interface defining the props passed to Leaderboard component
interface LeaderboardProps {
  mazeId: number; // ID of the maze to fetch leaderboard for
  token: string; // Authentication token for API requests
}

// Leaderboard component that displays top players for a specific maze
const Leaderboard: React.FC<LeaderboardProps> = ({ mazeId, token }) => {
  // State for storing the leaderboard data from the server
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  // State for tracking whether data is currently being loaded
  const [loading, setLoading] = useState(true);

  // Async function to fetch leaderboard data from the server
  const fetchLeaderboard = useCallback(async () => {
    try {
      // Make HTTP GET request to the leaderboard endpoint with maze ID
      const response = await fetch(
        `http://localhost:8000/leaderboard/${mazeId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Include auth token in headers
        }
      );
      // Parse the JSON response from the server
      const data = await response.json();
      // Update leaderboard state with fetched data (with fallback to empty array)
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      // Log any errors that occur during the fetch operation
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      // Always set loading to false, regardless of success or failure
      setLoading(false);
    }
  }, [mazeId, token]); // Dependency array ensures function is recreated when mazeId or token changes

  // Effect hook to fetch leaderboard when component mounts or fetchLeaderboard changes
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      // Container with white background, padding, rounded corners, and shadow
      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Leaderboard title */}
        <h3 className="text-lg font-bold mb-4">Leaderboard</h3>
        {/* Loading message */}
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Return the main leaderboard display
  return (
    // Container with white background, padding, rounded corners, and shadow
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Leaderboard title */}
      <h3 className="text-lg font-bold mb-4">Leaderboard</h3>

      {/* Conditional rendering based on whether there are any entries */}
      {leaderboard.length === 0 ? (
        // Show message when no games have been completed yet
        <p className="text-gray-500">No completed games yet</p>
      ) : (
        // Display the list of leaderboard entries
        <div className="space-y-2">
          {/* Map through first 10 entries and render each one */}
          {leaderboard.slice(0, 10).map((entry, index) => (
            // Individual leaderboard entry container
            <div
              key={index} // React key for list rendering
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
              // Styling: flexbox layout, space between items, light gray background
            >
              {/* Left side: username and move count */}
              <div>
                {/* Username in bold */}
                <span className="font-medium">{entry.users.username}</span>
                {/* Move count in smaller, gray text */}
                <span className="text-sm text-gray-600 ml-2">
                  {entry.moves.length} moves
                </span>
              </div>
              {/* Right side: completion date */}
              <span className="text-xs text-gray-500">
                {/* Convert timestamp to localized date string */}
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export the Leaderboard component as the default export
export default Leaderboard;
