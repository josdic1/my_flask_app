import { useNavigate } from "react-router-dom";

function TrackLinkItem({ trackLink, onDeleteTrackLink }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/track_links/edit/${trackLink.id}`);
  };

  const handleDelete = () => {
    onDeleteTrackLink(trackLink.id);
  };

  return (
    <tr id={trackLink.id}>
      <td>{trackLink.id}</td>
      <td>{trackLink.link_type}</td>
      <td>{trackLink.link_url}</td>
      <td>{trackLink.track_id}</td>
      <td>
        <button type="button" onClick={handleUpdate}>
          update
        </button>
      </td>
      <td>
        <button type="button" onClick={handleDelete}>
          delete
        </button>
      </td>
    </tr>
  );
}

export default TrackLinkItem;