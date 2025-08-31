// Import React and useState hook for component functionality and state management
import React, { useState } from "react";

// TypeScript interface defining the props passed to Auth component
interface AuthProps {
  onLogin: (token: string) => void; // Callback function to handle successful login
}

// Auth component that handles user authentication (login and signup)
const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  // State to toggle between login and signup modes
  const [isLogin, setIsLogin] = useState(true);
  // State for form data (username, email, password)
  const [formData, setFormData] = useState({
    username: "", // Username field (only for signup)
    email: "", // Email field (required for both)
    password: "", // Password field (required for both)
  });
  // State to track whether a request is in progress
  const [loading, setLoading] = useState(false);
  // State to store error messages for display
  const [error, setError] = useState("");

  // Async function to handle form submission (login or signup)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to show spinner/disable form
    setError(""); // Clear any previous error messages

    try {
      // Determine which endpoint to use based on current mode
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      // Prepare request body - login only needs email/password, signup needs all fields
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      // Make HTTP POST request to the authentication endpoint
      const response = await fetch(`https://mazegame-ygme.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Specify JSON content type
        body: JSON.stringify(body), // Convert data to JSON string
      });

      // Parse the server response
      const data = await response.json();

      // Check if the request was successful
      if (response.ok) {
        if (isLogin) {
          // For login: call the parent's onLogin function with the access token
          onLogin(data.access_token);
        } else {
          // For signup: switch to login mode and show success message
          setIsLogin(true);
          setError("Account created! Please log in.");
        }
      } else {
        // Handle authentication errors from the server
        setError(data.detail || "Authentication failed");
      }
    } catch (err) {
      // Handle network or other errors
      setError("Network error. Please try again.");
    } finally {
      // Always reset loading state, regardless of success or failure
      setLoading(false);
    }
  };

  // Return the authentication form JSX
  return (
    // Full-screen container with centered content and gray background
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Centered container with max width and vertical spacing */}
      <div className="max-w-md w-full space-y-8">
        {/* Header section */}
        <div>
          {/* Dynamic title based on current mode (login or signup) */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
        </div>

        {/* Authentication form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error message display - only shown when there's an error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Form fields container */}
          <div className="space-y-4">
            {/* Username field - only shown during signup */}
            {!isLogin && (
              <input
                type="text" // HTML text input type
                placeholder="Username" // Placeholder text
                value={formData.username} // Controlled input value
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                // Update username in form data when input changes
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required // HTML required attribute
              />
            )}

            {/* Email field - required for both login and signup */}
            <input
              type="email" // HTML email input type with validation
              placeholder="Email address" // Placeholder text
              value={formData.email} // Controlled input value
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              // Update email in form data when input changes
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required // HTML required attribute
            />

            {/* Password field - required for both login and signup */}
            <input
              type="password" // HTML password input type (hidden text)
              placeholder="Password" // Placeholder text
              value={formData.password} // Controlled input value
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              // Update password in form data when input changes
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required // HTML required attribute
            />
          </div>

          {/* Submit button */}
          <button
            type="submit" // HTML submit button type
            disabled={loading} // Disable when request is in progress
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            // Styling: full width, centered text, indigo background, hover effect, gray when disabled
          >
            {/* Dynamic button text based on loading state and current mode */}
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

          {/* Toggle between login and signup modes */}
          <div className="text-center">
            <button
              type="button" // HTML button type (not submit)
              onClick={() => setIsLogin(!isLogin)} // Toggle between login and signup
              className="text-indigo-600 hover:text-indigo-500"
              // Styling: indigo text with hover effect
            >
              {/* Dynamic text based on current mode */}
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the Auth component as the default export
export default Auth;
