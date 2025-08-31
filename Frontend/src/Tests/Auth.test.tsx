import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Auth from '../components/Auth';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('Auth Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    mockOnLogin.mockClear();
  });

  describe('Login functionality', () => {
    test('renders login form by default', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
    });

    test('successful login calls onLogin with token', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ access_token: 'mock-token' })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });
      });

      expect(mockOnLogin).toHaveBeenCalledWith('mock-token');
    });

    test('failed login shows error message', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ detail: 'Incorrect email or password' })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Incorrect email or password')).toBeInTheDocument();
      });

      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('network error shows generic error message', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
      });

      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('shows loading state during login', async () => {
      mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Signup functionality', () => {
    test('renders signup form when toggled', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      fireEvent.click(screen.getByText("Don't have an account? Sign up"));
      
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    test('successful signup switches to login mode with success message', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'User created successfully' })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.click(screen.getByText("Don't have an account? Sign up"));

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          })
        });
      });

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByText('Account created! Please log in.')).toBeInTheDocument();
    });

    test('failed signup shows error message', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ detail: 'Email already registered' })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.click(screen.getByText("Don't have an account? Sign up"));

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });

      expect(screen.getByText('Create your account')).toBeInTheDocument();
    });

    test('network error during signup shows generic error message', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.click(screen.getByText("Don't have an account? Sign up"));

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
      });
    });

    test('shows loading state during signup', async () => {
      mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.click(screen.getByText("Don't have an account? Sign up"));

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Form validation', () => {
    test('requires email and password for login', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('requires username, email and password for signup', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      fireEvent.click(screen.getByText("Don't have an account? Sign up"));
      
      const usernameInput = screen.getByPlaceholderText('Username');
      const emailInput = screen.getByPlaceholderText('Email address');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      expect(usernameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('email input has correct type', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByPlaceholderText('Email address');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('password input has correct type', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Mode switching', () => {
    test('can switch between login and signup modes', () => {
      render(<Auth onLogin={mockOnLogin} />);
      
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();
      
      fireEvent.click(screen.getByText("Don't have an account? Sign up"));
      
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByText('Already have an account? Sign in')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Already have an account? Sign in'));
      
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    test('clears error message when switching modes', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ detail: 'Login failed' })
      };
      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      render(<Auth onLogin={mockOnLogin} />);

      fireEvent.change(screen.getByPlaceholderText('Email address'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Login failed')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Don't have an account? Sign up"));

      expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
    });
  });
});
