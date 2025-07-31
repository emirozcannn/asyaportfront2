import React, { useEffect, useState } from 'react';
import { fetchAssets, addAsset, updateAsset, deleteAsset } from '../api/supabaseAssets';
import type { Asset } from '../types/Asset';


const emptyAsset: Omit<Asset, 'id' | 'created_at'> = {
  name: '',
  serial_number: '',
  category: '',
  status: '',
  assigned_to_id: '',
};

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [form, setForm] = useState<Omit<Asset, 'id' | 'created_at'>>(emptyAsset);
  const [saving, setSaving] = useState(false);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await fetchAssets();
      setAssets(data);
    } catch (err: any) {
      setError('Varlıklar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleOpenAdd = () => {
    setEditAsset(null);
    setForm(emptyAsset);
    setShowModal(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setEditAsset(asset);
    setForm({ ...asset });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditAsset(null);
    setForm(emptyAsset);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editAsset) {
        await updateAsset(editAsset.id, form);
      } else {
        await addAsset(form);
      }
      await loadAssets();
      handleCloseModal();
    } catch (err: any) {
      setError('Kayıt işlemi başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`${asset.name} adlı varlık silinsin mi?`)) return;
    try {
      await deleteAsset(asset.id);
      await loadAssets();
    } catch {
      setError('Silme işlemi başarısız.');
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Varlıklar</h2>
        <button className="btn btn-success" onClick={handleOpenAdd}>
          Yeni Varlık
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Ad</th>
              <th>Seri No</th>
              <th>Kategori</th>
              <th>Durum</th>
              <th>Atanan Kullanıcı ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center">Yükleniyor...</td></tr>
            ) : assets.length === 0 ? (
              <tr><td colSpan={7} className="text-center">Kayıt yok</td></tr>
            ) : (
              assets.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.serial_number}</td>
                  <td>{a.category}</td>
                  <td>{a.status}</td>
                  <td>{a.assigned_to_id || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleOpenEdit(a)}>Düzenle</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a)}>Sil</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">{editAsset ? 'Varlık Düzenle' : 'Yeni Varlık'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ad</label>
                    <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Seri No</label>
                    <input name="serial_number" className="form-control" value={form.serial_number} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Durum</label>
                    <input name="status" className="form-control" value={form.status} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Atanan Kullanıcı ID</label>
                    <input name="assigned_to_id" className="form-control" value={form.assigned_to_id || ''} onChange={handleChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>İptal</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
