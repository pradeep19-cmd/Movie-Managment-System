import { useEffect, useState } from 'react';
import { Building2, Plus, Pencil, Trash2, MapPin, Users } from 'lucide-react';
import theaterService from '../../services/theaterService';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { toast } from '../../components/ToastContainer';

const INITIAL_FORM = { theaterName: '', location: '', totalSeats: '' };

const AdminTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTheaters = () => {
    setLoading(true);
    theaterService.getAllTheaters()
      .then((r) => setTheaters(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTheaters(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditTarget(t);
    setForm({ theaterName: t.theaterName || '', location: t.location || '', totalSeats: t.totalSeats || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.theaterName) { toast.error('Theater name is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, totalSeats: parseInt(form.totalSeats) || 0 };
      if (editTarget) {
        await theaterService.updateTheater(editTarget.id, payload);
        toast.success('Theater updated!');
      } else {
        await theaterService.addTheater(payload);
        toast.success('Theater added!');
      }
      setModalOpen(false);
      fetchTheaters();
    } catch (err) {
      toast.error(err.message || 'Failed to save theater.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await theaterService.deleteTheater(deleteTarget.id);
      toast.success('Theater deleted.');
      setTheaters((p) => p.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete theater.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 size={24} className="text-blue-400" />
            Theater Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? '...' : `${theaters.length} theater${theaters.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Theater
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading theaters..." />
      ) : theaters.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No theaters yet"
          message="Add your first theater."
          action={{ label: 'Add Theater', onClick: openAdd }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {theaters.map((theater) => (
            <div key={theater.id} className="card p-5 hover:border-blue-500/20 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-xl flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <Building2 size={22} className="text-blue-400" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(theater)}
                    className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(theater)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 className="text-white font-bold text-lg mb-1">{theater.theaterName}</h3>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                <MapPin size={13} className="text-red-400" />
                {theater.location}
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Users size={13} className="text-emerald-400" />
                {theater.totalSeats} total seats
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Theater' : 'Add Theater'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Theater Name *</label>
            <input
              className="input-field"
              placeholder="PVR Cinemas"
              value={form.theaterName}
              onChange={(e) => setForm((p) => ({ ...p, theaterName: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Location</label>
            <input
              className="input-field"
              placeholder="City, Area"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Total Seats</label>
            <input
              type="number"
              className="input-field"
              placeholder="250"
              min={1}
              value={form.totalSeats}
              onChange={(e) => setForm((p) => ({ ...p, totalSeats: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost border border-white/10">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editTarget ? 'Update' : 'Add Theater'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Theater" size="sm">
        <div className="text-center">
          <Trash2 size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-1">Delete this theater?</p>
          <p className="text-white font-bold mb-6">"{deleteTarget?.theaterName}"</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-ghost border border-white/10">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 btn-danger">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTheaters;
