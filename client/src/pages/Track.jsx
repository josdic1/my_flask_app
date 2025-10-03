import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";
import UserContext from "../contexts/UserContext";
import TrackLinkContext from "../contexts/TrackLinkContext";
import TrackLinkList from "../components/TrackLinkList";

function Track() {
  const { id } = useParams();
  const { tracks } = useContext(TrackContext);
  const { users } = useContext(UserContext);
  const { trackLinks, onDeleteTrackLink, loading, error } = useContext(TrackLinkContext);
  const [trackOwner, setTrackOwner] = useState("");
  const navigate = useNavigate();

  const track = tracks.find((t) => t.id === Number(id));

  useEffect(() => {
    if (track) {
      const user = users.find((u) => Number(u.id) === Number(track.user_id));
      setTrackOwner(user ? user.name : "Unknown");
    }
  }, [users, track]);

  if (!track) return <p>Track not found</p>;

  const onAddLinkClick = () => navigate(`/track_links/new/${id}`);

  const filteredTrackLinks = trackLinks.filter(
    (tl) => Number(tl.track_id) === Number(id)
  );

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>{track.track}</h2>
      <p><strong>Artist:</strong> {track.artist}</p>
      <p><strong>Genre:</strong> {track.genre}</p>
      <p><strong>Added By:</strong> {trackOwner} on {track.created_date}</p>
      <p><strong>Modified By:</strong> {trackOwner} on {track.updated_date}</p>
      <hr />
      <h3>Links</h3>
      <button type="button" onClick={onAddLinkClick}>
        Add Link
      </button>
      {filteredTrackLinks.length > 0 ? (
        <TrackLinkList
          links={filteredTrackLinks}
          onDeleteTrackLink={onDeleteTrackLink}
        />
      ) : (
        <p>No links found</p>
      )}
    </div>
  );
}

export default Track;