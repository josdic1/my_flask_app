import { useState, useEffect } from "react";
import TrackLinkContext from "../contexts/TrackLinkContext";
import api from "../api";


function TrackLinkProvider({ children }) {
  const [trackLinks, setTrackLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchTrackLinks(); }, []);

  async function fetchTrackLinks() {
    try {
      setLoading(true);
      const { data } = await api.get("/track_links");
      setTrackLinks(data || []);
    } catch (err) { setError(err.response?.data || err.message); }
    finally { setLoading(false); }
  }

async function addTrackLink(trackLink) {
  try {
    const { data } = await api.post("/track_links", trackLink);
    setTrackLinks(prev => [...prev, data]);
  } catch (err) { 
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
      await api.delete(`/track_links/${id}`);
      setTrackLinks(prev => prev.filter(tl => tl.id !== id));
    } catch (err) { setError(err.response?.data || err.message); }
  }

  return (
    <TrackLinkContext.Provider value={{
      trackLinks, addTrackLink, updateTrackLink, deleteTrackLink
    }}>
      {children}
    </TrackLinkContext.Provider>
  );
}

export default TrackLinkProvider;
