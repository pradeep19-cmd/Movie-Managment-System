import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

const PosterUpload = ({ value, onChange, preview, setPreview }) => {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    inputRef.current.value = '';
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 group">
          <img
            src={preview}
            alt="Poster preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium backdrop-blur-sm transition-all"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs text-white/70 truncate bg-black/50 px-2 py-1 rounded">
              {value?.name || 'Current poster'}
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-red-500 bg-red-500/10'
              : 'border-white/15 bg-white/3 hover:border-red-500/50 hover:bg-red-500/5'
          }`}
        >
          <div className={`p-4 rounded-full transition-colors ${dragging ? 'bg-red-500/20' : 'bg-white/5'}`}>
            {dragging ? (
              <ImageIcon size={28} className="text-red-400" />
            ) : (
              <Upload size={28} className="text-gray-500" />
            )}
          </div>
          <div className="text-center">
            <p className="text-gray-300 font-medium text-sm">
              {dragging ? 'Drop your image here' : 'Upload Movie Poster'}
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Drag & drop or click to browse — JPG, PNG, WEBP
            </p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default PosterUpload;
