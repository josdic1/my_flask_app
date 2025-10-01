import { useState, useEffect } from "react";
import TrackContext from "../contexts/TrackContext";
import api from "../api";


function TrackProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchTracks(); }, []);

  async function fetchTracks() {
    try {
      setLoading(true);
      const { data } = await api.get("/tracks");
      setTracks(data || []);
    } catch (err) { setError(err.response?.data || err.message); }
    finally { setLoading(false); }
  }

  async function handleNewTrack(trackData) {
    try {
      const { data } = await api.post("/tracks", trackData);
      setTracks(prev => [...prev, data]);
    } catch (err) { setError(err.response?.data || err.message); }
  }

  async function updateTrack(id, updatedFields) {
    try {
      const { data } = await api.patch(`/tracks/${id}`, updatedFields);
      setTracks(prev => prev.map(t => t.id === id ? data : t));
    } catch (err) { setError(err.response?.data || err.message); }
  }

  async function deleteTrack(id) {
    try {
      await api.delete(`/tracks/${id}`);
      setTracks(prev => prev.filter(t => t.id !== id));
    } catch (err) { setError(err.response?.data || err.message); }
  }

  return (
    <TrackContext.Provider value={{
      tracks, loading, error,
      fetchTracks, handleNewTrack, updateTrack, deleteTrack, setTracks
    }}>
      {children}
    </TrackContext.Provider>
  );
}

export { TrackProvider };
export default TrackContext;
