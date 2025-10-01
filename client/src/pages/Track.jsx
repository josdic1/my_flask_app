import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";
import UserContext from "../contexts/UserContext";
import api from "../api";

function Track() {
  const { id } = useParams();
  const { tracks } = useContext(TrackContext);
  const { users } = useContext(UserContext);
  const [trackLinks, setTrackLinks] = useState([]);
  const [trackOwner, setTrackOwner] = useState("");
  const navigate = useNavigate();

  // Find the track from TrackContext
  const track = tracks.find((t) => t.id === Number(id));

  // Load links for this track on mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get(`/tracks/${id}`);
        setTrackLinks(response.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    if (track) {
      fetchLinks();
    }
  }, [id, track]);

  // Match the track's user to display the owner name
  useEffect(() => {
    if (track) {
      const user = users.find((u) => Number(u.id) === Number(track.user_id));
      if (user) {
        setTrackOwner(user.name);
      } else {
        setTrackOwner("Unknown");
      }
    }
  }, [users, track]);

  if (!track) {
    return <p>Track not found</p>;
  }

  return (
    <div>
      <h2>{track.track}</h2>
      <p>
        **Artist:** {track.artist}
      </p>
      <p>
        **Genre:** {track.genre}
      </p>
      <p>
        **Added By:** {trackOwner} on {new Date(track.created_date).toLocaleDateString()}
      </p>
      
      <hr />

      <h3>Links</h3>
     
    </div>
  );
}

export default Track;