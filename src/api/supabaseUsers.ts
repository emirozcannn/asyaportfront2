import { supabase } from '../supabaseConfig';
import type { User } from '../types/User';

// Backend API base URL - doğru port
const API_BASE_URL = 'http://localhost:5073'; // veya 'https://localhost:7190'

export async function fetchUsers(): Promise<User[]> {
  try {
    console.log('Fetching users from:', `${API_BASE_URL}/api/users`);
    
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Fetched users:', data);
    return data;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
}

// Backend API kullanarak user oluştur
export async function addUser(user: Omit<User, 'id' | 'created_at'> & { password?: string }): Promise<User> {
  const session = await supabase.auth.getSession();
  
  const requestBody = {
    email: user.email,
    password: user.password || 'TempPass123!',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    departmentId: user.department_id || null
  };

  console.log('Request body:', requestBody);
  
  const response = await fetch(`${API_BASE_URL}/api/users/create-auth-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.data.session?.access_token}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed to create user: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.profileUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const session = await supabase.auth.getSession();
  
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.data.session?.access_token}`
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }

  return await response.json();
}

export async function deleteUser(id: string): Promise<void> {
  const session = await supabase.auth.getSession();
  
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.data.session?.access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
}