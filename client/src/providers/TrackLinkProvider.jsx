import { useState, useEffect } from "react";
import TrackLinkContext from "../contexts/TrackLinkContext";
import Toast from "../components/Toast";
import api from "../api";

function TrackLinkProvider({ children }) {
  const [trackLinks, setTrackLinks] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrackLinks();
  }, []);

  const showToast = (message, type = "info") => {
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
    } catch (err) {
      setError(err.response?.data || err.message);
      showToast(err.response?.data?.message || "Failed to fetch track links", "error");
    } finally {
      setLoading(false);
    }
  }

  async function addTrackLink(trackLink) {
    try {
      const { data } = await api.post("/track_links", trackLink);
      setTrackLinks((prev) => [...prev, data]);
      showToast("Track link added successfully!", "success");
    } catch (err) {
      setError(err.response?.data || err.message);
      showToast(err.response?.data?.message || "Failed to add track link", "error");
    }
  }

  async function updateTrackLink(id, updatedTrackLink) {
    try {
      const { data } = await api.patch(`/track_links/${id}`, updatedTrackLink);
      setTrackLinks((prev) => prev.map((tl) => (tl.id === id ? data : tl)));
      showToast("Track link updated successfully!", "success");
    } catch (err) {
      setError(err.response?.data || err.message);
      showToast(err.response?.data?.message || "Failed to update track link", "error");
    }
  }

  async function onDeleteTrackLink(id) {
    try {
      await api.delete(`/track_links/${id}`);
      setTrackLinks((prev) => prev.filter((tl) => tl.id !== id));
      showToast("Track link deleted successfully!", "success");
      return { success: true };
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete track link", "error");
      return { success: false };
    }
  }

  return (
    <TrackLinkContext.Provider
      value={{
        trackLinks,
        addTrackLink,
        updateTrackLink,
        onDeleteTrackLink,
        loading,
        error,
        showToast,
      }}
    >
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </TrackLinkContext.Provider>
  );
}

export default TrackLinkProvider;