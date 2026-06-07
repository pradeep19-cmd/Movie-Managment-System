import { useEffect, useState } from 'react';
import { Film, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import movieService from '../../services/movieService';
import Modal from '../../components/Modal';
import PosterUpload from '../../components/PosterUpload';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { toast } from '../../components/ToastContainer';
import { Link } from 'react-router-dom';

const INITIAL_FORM = {
  title: '',
  genre: '',
  language: '',
  duration: '',
  description: '',
};

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = () => {
    setLoading(true);
    movieService.getAllMovies()
      .then((r) => setMovies(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMovies(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setPosterFile(null);
    setPosterPreview(null);
    setModalOpen(true);
  };

  const openEdit = (movie) => {
    setEditTarget(movie);
    setForm({
      title: movie.title || '',
      genre: movie.genre || '',
      language: movie.language || '',
      duration: movie.duration || '',
      description: movie.description || '',
    });
    setPosterFile(null);
    setPosterPreview(movie.imageData ? movieService.getPosterUrl(movie) : null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('genre', form.genre);
      fd.append('language', form.language);
      fd.append('duration', form.duration ? parseInt(form.duration) : 0);
      fd.append('description', form.description || '');
      if (posterFile) fd.append('imageFile', posterFile);

if (editTarget) {
  await movieService.updateMovie(editTarget.id, form);

        toast.success('Movie updated successfully!');
      } else {
        await movieService.addMovie(fd);
        toast.success('Movie added successfully!');
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.message || 'Failed to save movie.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await movieService.deleteMovie(deleteTarget.id);
      toast.success('Movie deleted.');
      setMovies((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete movie.');
    } finally {
      setDeleting(false);
    }
  };

  const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='80' viewBox='0 0 60 80'%3E%3Crect width='60' height='80' fill='%231c1c2e'/%3E%3Ctext x='30' y='40' text-anchor='middle' dy='.3em' fill='%2360607a' font-size='8' font-family='sans-serif'%3ENo Poster%3C/text%3E%3C/svg%3E";

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Film size={24} className="text-red-500" />
            Movie Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? '...' : `${movies.length} movie${movies.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Movie
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading movies..." />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No movies yet"
          message="Add your first movie to get started."
          action={{ label: 'Add Movie', onClick: openAdd }}
        />
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <img
                      src={movieService.getPosterUrl(movie) || PLACEHOLDER}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-lg border border-white/10"
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                  </td>
                  <td>
                    <p className="text-white font-semibold">{movie.title}</p>
                    <p className="text-gray-500 text-xs truncate max-w-xs">{movie.description}</p>
                  </td>
                  <td><span className="badge-primary">{movie.genre}</span></td>
                  <td className="text-gray-300">{movie.language}</td>
                  <td className="text-gray-300">{movie.duration} min</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/movies/${movie.id}`}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        onClick={() => openEdit(movie)}
                        className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(movie)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Movie' : 'Add New Movie'}
        size="lg"
      >
        <div className="grid gap-4">
          <div>
            <label className="label">Movie Poster</label>
            <PosterUpload
              value={posterFile}
              onChange={setPosterFile}
              preview={posterPreview}
              setPreview={setPosterPreview}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Title *</label>
              <input
                className="input-field"
                placeholder="Movie title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Genre</label>
              <select
                className="input-field"
                value={form.genre}
                onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
              >
                <option value="">Select genre</option>
                {['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Animation'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Language</label>
              <select
                className="input-field"
                value={form.language}
                onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
              >
                <option value="">Select language</option>
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                className="input-field"
                placeholder="120"
                min={1}
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Movie synopsis..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost border border-white/10">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
                : editTarget ? 'Update Movie' : 'Add Movie'
              }
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Movie" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300 mb-1">Delete this movie permanently?</p>
          <p className="text-white font-bold mb-6">"{deleteTarget?.title}"</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-ghost border border-white/10">Keep</button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 btn-danger">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMovies;
