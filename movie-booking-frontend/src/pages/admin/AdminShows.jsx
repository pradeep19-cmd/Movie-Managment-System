import { useEffect, useState } from 'react';
import { Calendar, Plus, Pencil, Trash2, Clock, DollarSign } from 'lucide-react';
import showService from '../../services/showService';
import movieService from '../../services/movieService';
import theaterService from '../../services/theaterService';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { toast } from '../../components/ToastContainer';

const INITIAL_FORM = {
  movieId: '',
  theaterId: '',
  showDate: '',
  showTime: '',
  ticketPrice: '',
};

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.allSettled([
      showService.getAllShows(),
      movieService.getAllMovies(),
      theaterService.getAllTheaters(),
    ]).then(([s, m, t]) => {
      setShows(s.status === 'fulfilled' ? s.value.data : []);
      setMovies(m.status === 'fulfilled' ? m.value.data : []);
      setTheaters(t.status === 'fulfilled' ? t.value.data : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEdit = (show) => {
    setEditTarget(show);
    setForm({
      movieId: show.movie?.id || '',
      theaterId: show.theater?.id || '',
      showDate: show.showDate || '',
      showTime: show.showTime || '',
      ticketPrice: show.ticketPrice || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.movieId || !form.theaterId || !form.showDate || !form.showTime) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        movie: { id: parseInt(form.movieId) },
        theater: { id: parseInt(form.theaterId) },
        showDate: form.showDate,
        showTime: form.showTime,
        ticketPrice: parseFloat(form.ticketPrice) || 0,
      };
      if (editTarget) {
        await showService.updateShow(editTarget.id, payload);
        toast.success('Show updated!');
      } else {
        await showService.createShow(payload);
        toast.success('Show created!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save show.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await showService.deleteShow(deleteTarget.id);
      toast.success('Show deleted.');
      setShows((p) => p.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete show.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar size={24} className="text-purple-400" />
            Show Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">{loading ? '...' : `${shows.length} shows`}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Create Show
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading shows..." />
      ) : shows.length === 0 ? (
        <EmptyState icon={Calendar} title="No shows yet" message="Create your first show." action={{ label: 'Create Show', onClick: openAdd }} />
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr>
                <th>#</th>
                <th>Movie</th>
                <th>Theater</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id}>
                  <td className="font-mono text-gray-600">#{show.id}</td>
                  <td>
                    <p className="text-white font-medium">{show.movie?.title || '—'}</p>
                    <p className="text-gray-500 text-xs">{show.movie?.genre}</p>
                  </td>
                  <td>
                    <p className="text-gray-300">{show.theater?.name || '—'}</p>
                    <p className="text-gray-500 text-xs">{show.theater?.location}</p>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Calendar size={12} className="text-red-400" /> {show.showDate}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Clock size={12} className="text-amber-400" /> {show.showTime}
                    </span>
                  </td>
                  <td>
                    <span className="text-white font-semibold">₹{show.ticketPrice}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(show)} className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(show)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Show' : 'Create Show'} size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Movie *</label>
            <select
              className="input-field"
              value={form.movieId}
              onChange={(e) => setForm((p) => ({ ...p, movieId: e.target.value }))}
            >
              <option value="">Select movie</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Theater *</label>
            <select
              className="input-field"
              value={form.theaterId}
              onChange={(e) => setForm((p) => ({ ...p, theaterId: e.target.value }))}
            >
              <option value="">Select theater</option>
              {theaters.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.location}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input-field" value={form.showDate} onChange={(e) => setForm((p) => ({ ...p, showDate: e.target.value }))} />
            </div>
            <div>
              <label className="label">Time *</label>
              <input type="time" className="input-field" value={form.showTime} onChange={(e) => setForm((p) => ({ ...p, showTime: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Ticket Price (₹)</label>
            <input type="number" className="input-field" placeholder="250" min={0} value={form.ticketPrice} onChange={(e) => setForm((p) => ({ ...p, ticketPrice: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost border border-white/10">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editTarget ? 'Update Show' : 'Create Show'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Show" size="sm">
        <div className="text-center">
          <Trash2 size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-1">Delete this show?</p>
          <p className="text-white font-bold mb-2">{deleteTarget?.movie?.title}</p>
          <p className="text-gray-500 text-sm mb-6">{deleteTarget?.showDate} at {deleteTarget?.showTime}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-ghost border border-white/10">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 btn-danger">{deleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminShows;
