import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";
import UserContext from "../contexts/UserContext";
import api from "../api";
import { formatDateTime } from '../utils/formatters';

function Track() {
    const { id } = useParams();
    const { tracks } = useContext(TrackContext);
    const { users } = useContext(UserContext);
    const [trackLinks, setTrackLinks] = useState([]);
    const [trackOwner, setTrackOwner] = useState("");
    const navigate = useNavigate();

    const track = tracks.find((t) => t.id === Number(id));

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await api.get(`/tracks/${id}`);
                setTrackLinks(response.data.links || []);
            } catch (error) {
                console.error("Error fetching links:", error);
            }
        };
        if (track) {
            fetchLinks();
        }
    }, [id, track]);
    
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

  const trackLinkData = trackLinks
     .filter((tl) => Number(tl.track_id) === Number(id)) 
    .map((tl) => (
      <p key={tl.id}>
        {tl.link_type}: {tl.link_url}
        </p>
    ))

 const linksDisplay = trackLinkData.length > 0 
  ? trackLinkData 
  : <p>No links yet.</p>;

  const onAddLinkClick = () => {
  navigate(`/track_links/new/${id}`);
}

  return (
    <>
    <div>
      <h2>{track.track}</h2>
      <p>
        **Artist:** {track.artist}
      </p>
      <p>
        **Genre:** {track.genre}
      </p>
     <p>
  **Added By:** {trackOwner} on {track.created_date}
</p>
<p>
  **Modified By:** {trackOwner} on {track.updated_date}
</p>
      
      <hr />

      <h3>Links</h3>
      <div>
        <button type='button' name='add-link' onClick={onAddLinkClick}> Add Link </button>
        {linksDisplay}
      </div>
      
    </div>
    </>
  );
}

export default Track;