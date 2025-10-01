import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TrackLinkContext from "../contexts/TrackLinkContext";

function TrackLinkFormNew() {
    const { addTrackLink } = useContext(TrackLinkContext);
    const { trackId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        link_type: "",
        link_url: "",
        track_id: trackId || ""
    });

    const onFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    function onSubmit(e) {
        e.preventDefault();
        if (!formData.link_type || !formData.link_url || !formData.track_id) {
            alert('Track link type, URL, or track ID cannot be empty');
            return;
        }
        addTrackLink(formData);
        navigate('/tracks');
        setFormData({
            link_type: "",
            link_url: "",
            track_id: trackId || ""
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="link_type">Link Type:</label>
                <input
                    type="text"
                    id="link_type"
                    name="link_type"
                    onChange={onFormChange}
                    value={formData.link_type}
                    placeholder="Enter track link type..."
                />
            </div>
            <div>
                <label htmlFor="link_url">Link URL:</label>
                <input
                    type="text"
                    id="link_url"
                    name="link_url"
                    onChange={onFormChange}
                    value={formData.link_url}
                    placeholder="Enter link URL..."
                />
            </div>
            <div>
                <label htmlFor="track_id">Track ID (read-only):</label>
                <input
                    type="text"
                    id="track_id"
                    name="track_id"
                    value={formData.track_id}
                    readOnly
                />
            </div>
            <button type="submit">Add Link</button>
        </form>
    );
}

export default TrackLinkFormNew;