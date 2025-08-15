import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UserDetailModal from './UserDetailModal' // Detay modalı
import UserEditModal from './UserEditModal'   // Düzenleme modalı

// User arayüzü, DTO'nuza uygun olmalı
interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    employeeNumber: string;
    createdAt: string;
    status?: 'Active' | 'Inactive';
}

const UserListPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    // API'den kullanıcıları çeken fonksiyon
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://api.yourdomain.com/api/users')
            setUsers(response.data)
        } catch (error) {
            console.error("Kullanıcılar alınırken hata oluştu:", error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Kullanıcıya tıklanınca detay modalını açma
    const handleDetailClick = (user: User) => {
        setSelectedUser(user)
        setShowDetailModal(true)
    }

    // Detay modalını kapatma
    const handleCloseDetailModal = () => {
        setShowDetailModal(false)
        setSelectedUser(null)
    }

    // Detay modalındaki 'Düzenle' butonuna basılınca çalışan fonksiyon
    const handleEditUser = (userId: string) => {
        handleCloseDetailModal() // Detay modalını kapat
        setShowEditModal(true)   // Düzenleme modalını aç
    }

    // Düzenleme modalını kapatma
    const handleCloseEditModal = () => {
        setShowEditModal(false)
        setSelectedUser(null) // State'i sıfırla
    }

    // Kullanıcı başarıyla güncellendiğinde listeyi yeniden çekme
    const handleUserUpdated = () => {
        fetchUsers()
        handleCloseEditModal()
    }

    return (
        <div>
            <h1>Kullanıcı Yönetimi</h1>
            
            <ul className="list-group">
                {users.map(user => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{user.fullName}</strong>
                            <small className="text-muted ms-2">{user.email}</small>
                        </div>
                        <Button variant="info" onClick={() => handleDetailClick(user)}>
                            Detay
                        </Button>
                    </li>
                ))}
            </ul>

            {/* Kullanıcı Detay Modal'ı */}
            <UserDetailModal
                show={showDetailModal}
                user={selectedUser}
                onClose={handleCloseDetailModal}
                onEdit={handleEditUser} // Burası, Detay modalındaki 'Düzenle' butonunu tetikler
            />

            {/* Kullanıcı Düzenleme Modal'ı */}
            <UserEditModal
                show={showEditModal}
                userId={selectedUser?.id || ''} // Düzenlenecek kullanıcının ID'sini gönder
                onClose={handleCloseEditModal}
                onUserUpdated={handleUserUpdated}
            />
        </div>
    )
}

export default UserListPage