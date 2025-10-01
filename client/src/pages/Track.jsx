import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";
import UserContext from "../contexts/UserContext";
import TrackLinkContext from "../contexts/TrackLinkContext";
import api from "../api";

function Track() {
    const { id } = useParams();
    const { tracks } = useContext(TrackContext);
    const { deleteTrackLink } = useContext(TrackLinkContext);
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
            setTrackOwner(user ? user.name : "Unknown");
        }
    }, [users, track]);

    if (!track) {
        return <p>Track not found</p>;
    }

    const onAddLinkClick = () => {
        navigate(`/track_links/new/${id}`);
    };

 const onDeleteTrackLink = (linkId) => {
        deleteTrackLink(Number(linkId));
        const filteredList = trackLinks.filter(tl => tl.id !== Number(linkId))
        setTrackLinks(filteredList)
    };

    return (
        <div>
            <h2>{track.track}</h2>
            <p><strong>Artist:</strong> {track.artist}</p>
            <p><strong>Genre:</strong> {track.genre}</p>
            <p><strong>Added By:</strong> {trackOwner} on {track.created_date}</p>
            <p><strong>Modified By:</strong> {trackOwner} on {track.updated_date}</p>
            <hr />
            <h3>Links</h3>
            <button type="button" name="add-link" onClick={onAddLinkClick}>Add Link</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>URL</th>
                        <th>Track ID</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {trackLinks.length > 0 ? (
                        trackLinks
                            .filter((tl) => Number(tl.track_id) === Number(id))
                            .map((tl) => (
                                <tr key={tl.id}>
                                    <td>{tl.id}</td>
                                    <td>{tl.link_type}</td>
                                    <td>{tl.link_url}</td>
                                    <td>{tl.track_id}</td>
                                    <td><button type='button' onClick={() => onDeleteTrackLink(tl.id)}> x </button></td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="4">No links yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Track;