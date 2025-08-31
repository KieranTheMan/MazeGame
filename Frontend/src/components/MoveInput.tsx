// Import React and useState hook for component functionality and state management
import React, { useState } from "react";

// TypeScript interface defining the props passed to MoveInput component
interface MoveInputProps {
  onSubmitMove: (direction: string, steps: number) => void; // Callback function to handle move submission
  disabled: boolean; // Boolean flag to disable the form when needed
}

// MoveInput component that provides a form for players to input their moves
const MoveInput: React.FC<MoveInputProps> = ({ onSubmitMove, disabled }) => {
  // State for the selected direction (up, down, left, right)
  const [direction, setDirection] = useState("up");
  // State for the number of steps to move (1-10)
  const [steps, setSteps] = useState(1);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Validate that steps is within allowed range (1-10)
    if (steps > 0 && steps <= 10) {
      onSubmitMove(direction, steps); // Call the parent component's move handler
    }
  };

  // Return the form JSX
  return (
    // Form container with white background, padding, rounded corners, and shadow
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      {/* Form title */}
      <h3 className="text-lg font-bold mb-4">Enter Your Move</h3>

      {/* Grid layout for direction and steps inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Direction selection dropdown */}
        <div>
          {/* Label for the direction field */}
          <label className="block text-sm font-medium mb-2">Direction</label>
          {/* Dropdown select for choosing movement direction */}
          <select
            value={direction} // Controlled input - value from state
            onChange={(e) => setDirection(e.target.value)} // Update state when selection changes
            className="w-full p-2 border border-gray-300 rounded-md" // Styling classes
            disabled={disabled} // Disable when form is disabled
          >
            {/* Dropdown options for each direction */}
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>

        {/* Steps input field */}
        <div>
          {/* Label for the steps field */}
          <label className="block text-sm font-medium mb-2">Steps</label>
          {/* Number input for specifying how many steps to move */}
          <input
            type="number" // HTML number input type
            min="1" // Minimum allowed value
            max="10" // Maximum allowed value
            value={steps} // Controlled input - value from state
            onChange={(e) => setSteps(parseInt(e.target.value) || 1)} // Update state, fallback to 1 if invalid
            className="w-full p-2 border border-gray-300 rounded-md" // Styling classes
            disabled={disabled} // Disable when form is disabled
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit" // HTML submit button type
        disabled={disabled} // Disable when form is disabled
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        // Styling: full width, blue background, white text, hover effect, gray when disabled
      >
        Submit Move
      </button>
    </form>
  );
};

// Export the MoveInput component as the default export
export default MoveInput;
