import { useState, useEffect } from "react";
import TrackLinkContext from "../contexts/TrackLinkContext";
import Toast from "../components/Toast";
import api from "../api";


function TrackLinkProvider({ children }) {
  const [trackLinks, setTrackLinks] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchTrackLinks(); }, []);

 const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  async function fetchTrackLinks() {
    try {
      setLoading(true);
      const { data } = await api.get("/track_links");
      setTrackLinks(data || []);
    } catch (err) { setError(err.response?.data || err.message); }
    finally { setLoading(false); }
  }

async function addTrackLink(trackLink) {
    console.log("Adding track link:", trackLink, "Token:", localStorage.getItem("access_token"));
    try {
        const { data } = await api.post("/track_links", trackLink);
        setTrackLinks(prev => [...prev, data]);
    } catch (err) {
        console.error("Add track link error:", err.response || err.message);
        setError(err.response?.data || err.message);
    }
}

  async function updateTrackLink(id, updatedTrackLink) {
    try {
      const { data } = await api.patch(`/track_links/${id}`, updatedTrackLink);
      setTrackLinks(prev => prev.map(tl => tl.id === id ? data : tl));
    } catch (err) { setError(err.response?.data || err.message); }
  }

   async function deleteTrackLink(id) {
    try {
      id = Number(id);
      await api.delete(`/track_links/${id}`);
      setTrackLinks(prev => prev.filter(tl => tl.id !== id));
      showToast('Track link deleted successfully!', 'success');
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err.response || err.message);
      showToast(err.response?.data?.message || err.message || 'Failed to delete track link', 'error');
      return { success: false };
    }
  }




  return (
    <TrackLinkContext.Provider value={{
      trackLinks, addTrackLink, updateTrackLink, deleteTrackLink
    }}>
      
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast}
        />
      )}
      
    </TrackLinkContext.Provider>
  );
}

export default TrackLinkProvider;
