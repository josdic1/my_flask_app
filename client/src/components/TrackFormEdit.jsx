import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom";
import TrackContext from "../contexts/TrackContext";

function TrackFormEdit() {
    const [ formData, setFormData ] = useState({
        track: "",
        artist: "",
        genre: "",
    });

    const { tracks, updateTrack } = useContext(TrackContext)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const updating = tracks.find(t => t.id === Number(id))
        if (updating) {
            setFormData({
                track: updating.track,
                artist: updating.artist,
                genre: updating.genre
            })
        }
    }, [id, tracks])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateTrack({ id: Number(id), ...formData });
        if (result.success) {
            navigate('/tracks');
        }
        // Toast will show automatically from the provider!
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="track">Track Title:</label>
                <input
                    type="text"
                    id="track"
                    name="track"
                    value={formData.track}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="artist">Artist:</label>
                <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="genre">Genre:</label>
                <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default TrackFormEdit;