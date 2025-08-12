// hooks/useSimpleApi.js
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

// Helper function to get token from cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authToken') { // Change 'authToken' to your cookie name
      return value;
    }
  }
  return null;
};

export const useSimpleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Get token from cookies
      const token = getTokenFromCookies();
      
      const requestConfig = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
      };

      const fullUrl = `${API_BASE_URL}${url}`;
      
      // Console log request
      console.group(`🚀 API Request: ${requestConfig.method} ${fullUrl}`);
      console.log('Headers:', requestConfig.headers);
      if (requestConfig.body) {
        console.log('Body:', JSON.parse(requestConfig.body));
      }
      console.groupEnd();

      const response = await fetch(fullUrl, requestConfig);

      if (!response.ok) {
        console.log(response.json())
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Console log response
      console.group(`✅ API Response: ${requestConfig.method} ${fullUrl}`);
      console.log('Status:', response.status);
      console.log('Data:', data);
      console.groupEnd();

      setLoading(false);
      return data;

    } catch (err) {
      // Console log error
      console.group(`❌ API Error: ${options.method || 'GET'} ${url}`);
      console.error('Error:', err.message);
      console.groupEnd();

      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // All HTTP methods
  const get = (url, headers = {}) => request(url, { method: 'GET', headers });
  const post = (url, body, headers = {}) => request(url, { method: 'POST', body, headers });
  const put = (url, body, headers = {}) => request(url, { method: 'PUT', body, headers });
  const patch = (url, body, headers = {}) => request(url, { method: 'PATCH', body, headers });
  const del = (url, headers = {}) => request(url, { method: 'DELETE', headers });
  const head = (url, headers = {}) => request(url, { method: 'HEAD', headers });
  const options = (url, headers = {}) => request(url, { method: 'OPTIONS', headers });

  const clearError = () => setError(null);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    head,
    options,
    clearError,
  };
};

// Simple auth functions using the API
// Simple login function
export const login = async ({ email_id, password }) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_id, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail?.[0]?.msg || 'Login failed');
  }
  
  const result= await res.json();
    return result.data || result.detail || result;

};

// Simple signup function
export const signup = async ({ email_id, mobile_no, user_type, name, password }) => {
  const res = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_id, mobile_no, user_type, name, password })
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail?.[0]?.msg || 'Signup failed');
  }
  
  return res.json();
};

// Usage Examples:
/*
const MyComponent = () => {
  const { loading, error, get, post, put, patch, delete: deleteReq } = useSimpleApi();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await post('/users', userData);
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await put(`/users/${id}`, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const patchUser = async (id, partialData) => {
    try {
      const updatedUser = await patch(`/users/${id}`, partialData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    } catch (err) {
      console.error('Failed to patch user:', err);
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteReq(`/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={fetchUsers}>Fetch Users</button>
      <button onClick={() => createUser({ name: 'John', email: 'john@example.com' })}>
        Create User
      </button>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => updateUser(user.id, { ...user, name: 'Updated' })}>
            Update
          </button>
          <button onClick={() => patchUser(user.id, { status: 'active' })}>
            Patch
          </button>
          <button onClick={() => removeUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

// Custom headers example:
const fetchWithCustomHeaders = async () => {
  const { get } = useSimpleApi();
  
  try {
    const data = await get('/users', {
      'X-Custom-Header': 'custom-value',
      'Accept-Language': 'en-US'
    });
    console.log(data);
  } catch (error) {
    console.error('Request failed:', error);
  }
};
*/