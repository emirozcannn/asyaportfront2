import { supabase } from '../supabaseConfig'; // Supabase'i hala kullanıcı tablosu için kullanıyorsanız kalsın
import type { User } from '../types/User';
import { apiRequest, registerUser } from './supabaseAuth'; // apiRequest ve registerUser'ı yeni auth dosyasından al

// User management functions
export async function fetchUsers(): Promise<User[]> {
  try {
    console.log('Fetching users...');
    const data = await apiRequest('/api/users', {
      method: 'GET'
    });
    console.log('Fetched users:', data);
    return data || [];
  } catch (error) {
    console.error('Fetch users error:', error);
    throw new Error(`Kullanıcılar yüklenemedi: ${error.message}`);
  }
}

// Updated addUser to use the Auth/register endpoint
export async function addUser(user: Omit<User, 'id' | 'created_at'> & { password?: string }): Promise<User> {
  try {
    // İlk olarak kullanıcıyı Auth API'si ile kaydet
    // Backend'inizde kullanıcı oluşturma ve kimlik doğrulama ayrıysa, bu adım gerekli.
    // Eğer backend'inizde kullanıcı oluşturma işlemi aynı zamanda auth kaydını da yapıyorsa,
    // bu registerUser çağrısını doğrudan backend'deki /api/users POST çağrısına entegre edebilirsiniz.
    // Şimdilik, registerUser'ın sadece auth tarafında kayıt yaptığını ve userId döndürdüğünü varsayıyoruz.
    const authResult = await registerUser(
      user.email,
      user.password || 'TempPass123!', // Eğer şifre yoksa geçici bir şifre
      `${user.first_name} ${user.last_name}`
    );
    
    // Sonra kullanıcı profilini ek detaylarla oluştur
    const profileData = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      employee_number: user.employee_number,
      department_id: user.department_id,
      role: user.role,
      is_active: user.is_active,
      password_hash: user.password_hash, // Eğer backend password_hash'i client'tan bekliyorsa
      auth_user_id: authResult.userId // Auth kullanıcısına link
    };

    const profileResult = await apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    return profileResult;
  } catch (error) {
    console.error('Add user error:', error);
    throw new Error(`Kullanıcı oluşturulamadı: ${error.message}`);
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    const result = await apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return result;
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error(`Kullanıcı güncellenemedi: ${error.message}`);
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await apiRequest(`/api/users/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    throw new Error(`Kullanıcı silinemedi: ${error.message}`);
  }
}

// getCurrentUser ve loginUser fonksiyonları supabaseAuth.ts'ye taşındığı için burada kaldırıldı.
// Eğer Users bileşeninde hala getCurrentUser'a ihtiyacınız varsa, onu da supabaseAuth'tan import etmelisiniz.
