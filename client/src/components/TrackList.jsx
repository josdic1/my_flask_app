import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";
import TrackItem from "./TrackItem";

function TrackList() {
    const { tracks, deleteTrack,  } = useContext(TrackContext);
    const navigate = useNavigate();

    if (!tracks || tracks.length === 0) {
        return <p>The tracks list is empty.</p>;
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
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((t) => (
    <TrackItem
        key={t.id}
        track={t}
        onAddClick={() => navigate(`/track_links/new/${t.id}`)}
        onViewClick={() => navigate(`/tracks/${t.id}`)}
        onDeleteClick={() => deleteTrack(`${t.id}`)}
        onUpdateClick={() =>  navigate(`/tracks/${t.id}/edit`)}
    />
))}
                </tbody>
            </table>
        </>
    );
}

export default TrackList;