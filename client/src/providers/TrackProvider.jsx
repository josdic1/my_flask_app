import { useState, useEffect } from "react";
import TrackContext from "../contexts/TrackContext";
import Toast from "../components/Toast";
import api from "../api";

function TrackProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchTracks(); }, []);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  async function fetchTracks() {
    try {
      setLoading(true);
      const { data } = await api.get("/tracks");
      setTracks(data || []);
    } catch (err) { 
      showToast(err.response?.data?.message || err.message || 'Failed to fetch tracks', 'error');
    } finally { 
      setLoading(false); 
    }
  }

  async function addNewTrack(trackData) {
    try {
      const { data } = await api.post("/tracks", trackData);
      setTracks(prev => [...prev, data]);
      showToast('Track added successfully!', 'success');
      return { success: true };
    } catch (err) { 
      showToast(err.response?.data?.message || err.message || 'Failed to add track', 'error');
      return { success: false };
    }
  }

  async function updateTrack(updated) {
    console.log('Updating track:', updated);
    try {
      const { data } = await api.patch(`/tracks/${updated.id}`, updated);
      setTracks(prev => prev.map(t => t.id === Number(updated.id) ? data : t));
      showToast('Track updated successfully!', 'success');
      return { success: true };
    } catch (err) {
      console.error('Update error:', err.response || err.message);
      showToast(err.response?.data?.message || err.message || 'Failed to update track', 'error');
      return { success: false };
    }
  }

  async function deleteTrack(id) {
    try {
      id = Number(id);
      await api.delete(`/tracks/${id}`);
      setTracks(prev => prev.filter(t => t.id !== id));
      showToast('Track deleted successfully!', 'success');
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err.response || err.message);
      showToast(err.response?.data?.message || err.message || 'Failed to delete track', 'error');
      return { success: false };
    }
  }

  return (
    <TrackContext.Provider value={{
      tracks, loading,
      fetchTracks, addNewTrack, updateTrack, deleteTrack, setTracks
    }}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast}
        />
      )}
    </TrackContext.Provider>
  );
}

export default TrackProvider;