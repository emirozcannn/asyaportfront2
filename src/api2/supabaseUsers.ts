import { supabase } from '../supabaseConfig'; // Supabase'i hala kullanıcı tablosu için kullanıyorsanız kalsın
import type { User } from '../types/User';
import { apiRequest, registerUser } from './supabaseAuth'; // apiRequest ve registerUser'ı yeni auth dosyasından al

// Backend'den frontend'e mapping fonksiyonu
function mapBackendUserToFrontend(backendUser: any): User {
  return {
    id: backendUser.id || backendUser.Id,
    employeeNumber: backendUser.employeeNumber || backendUser.EmployeeNumber,
    firstName: backendUser.firstName || backendUser.FirstName,
    lastName: backendUser.lastName || backendUser.LastName,
    email: backendUser.email || backendUser.Email,
    role: backendUser.role || backendUser.Role,
    departmentId: backendUser.departmentId || backendUser.DepartmentId,
    isActive: backendUser.isActive !== undefined ? backendUser.isActive : backendUser.IsActive,
    createdAt: backendUser.createdAt || backendUser.CreatedAt,
    passwordHash: backendUser.passwordHash || backendUser.PasswordHash
  };
}

// User management functions
export async function fetchUsers(): Promise<User[]> {
  try {
    console.log('Fetching users...');
    const data = await apiRequest('/api/Users', {
      method: 'GET'
    });
    console.log('Fetched users:', data);
    // Backend'den gelen PascalCase'i frontend camelCase'e çevir
    return Array.isArray(data) ? data.map(mapBackendUserToFrontend) : [];
  } catch (error) {
    console.error('Fetch users error:', error);
    throw new Error(`Kullanıcılar yüklenemedi: ${error.message}`);
  }
}

// Updated addUser to use the correct endpoint and property names
export async function addUser(user: Omit<User, 'id' | 'created_at'> & { password?: string }): Promise<User> {
  try {
    // Register user in Auth (if needed)
    const authResult = await registerUser(
      user.email,
      user.password || 'TempPass123!',
      `${user.first_name} ${user.last_name}`
    );

    // Prepare data with PascalCase keys for backend
    const profileData = {
      employeeNumber: user.employee_number,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      password: user.password || 'TempPass123!', // Backend expects 'password'
      departmentId: user.department_id,
      role: user.role,
      isActive: user.is_active,
      passwordHash: user.password_hash, // If backend expects passwordHash
      authUserId: authResult.userId // If backend expects authUserId
    };

    const profileResult = await apiRequest('/api/Users', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return mapBackendUserToFrontend(profileResult);
  } catch (error) {
    console.error('Add user error:', error);
    throw new Error(`Kullanıcı oluşturulamadı: ${error.message}`);
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    // Convert updates to PascalCase
    const pascalUpdates: any = {};
    if (updates.employee_number !== undefined) pascalUpdates.employeeNumber = updates.employee_number;
    if (updates.first_name !== undefined) pascalUpdates.firstName = updates.first_name;
    if (updates.last_name !== undefined) pascalUpdates.lastName = updates.last_name;
    if (updates.email !== undefined) pascalUpdates.email = updates.email;
    if (updates.password_hash !== undefined) pascalUpdates.passwordHash = updates.password_hash;
    if (updates.department_id !== undefined) pascalUpdates.departmentId = updates.department_id;
    if (updates.role !== undefined) pascalUpdates.role = updates.role;
    if (updates.is_active !== undefined) pascalUpdates.isActive = updates.is_active;
    // Add other fields as needed

    const result = await apiRequest(`/api/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pascalUpdates)
    });
    return mapBackendUserToFrontend(result);
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error(`Kullanıcı güncellenemedi: ${error.message}`);
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await apiRequest(`/api/Users/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    throw new Error(`Kullanıcı silinemedi: ${error.message}`);
  }
}

export async function toggleUserStatus(id: string, isActive: boolean): Promise<User> {
  try {
    const result = await apiRequest(`/api/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive })
    });
    return mapBackendUserToFrontend(result);
  } catch (error) {
    console.error('Toggle user status error:', error);
    throw new Error(`Kullanıcı durumu değiştirilemedi: ${error.message}`);
  }
}

export async function fetchUserById(id: string): Promise<User> {
  try {
    const data = await apiRequest(`/api/Users/${id}`, {
      method: 'GET'
    });
    return mapBackendUserToFrontend(data);
  } catch (error) {
    console.error('Fetch user by id error:', error);
    throw new Error(`Kullanıcı alınamadı: ${error.message}`);
  }
}

export async function fetchUserByEmail(email: string): Promise<User> {
  try {
    const data = await apiRequest(`/api/Users/email/${encodeURIComponent(email)}`, {
      method: 'GET'
    });
    return mapBackendUserToFrontend(data);
  } catch (error) {
    console.error('Fetch user by email error:', error);
    throw new Error(`Kullanıcı alınamadı: ${error.message}`);
  }
}

// getCurrentUser ve loginUser fonksiyonları supabaseAuth.ts'ye taşındığı için burada kaldırıldı.
// Eğer Users bileşeninde hala getCurrentUser'a ihtiyacınız varsa, onu da supabaseAuth'tan import etmelisiniz.
