import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";
import TrackItem from "./TrackItem";

function TrackList() {
    const { tracks } = useContext(TrackContext);
    const navigate = useNavigate();

    if (!tracks || tracks.length === 0) {
        return <p>The tracks list is empty.</p>;
    }

    function onViewClick(id) {
        navigate(`/tracks/${id}`);
    }

function onAddLinkClick(trackId) {
  navigate(`/track_links/new/${trackId}`);
}

    return (
        <>
            <h3>Tracks</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Genre</th>
                        <th>View</th>
                        <th>Add Link</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((t) => (
                        <TrackItem
                            key={t.id}
                            track={t}
                            onViewClick={onViewClick}
                            onAddLinkClick={onAddLinkClick}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TrackList;