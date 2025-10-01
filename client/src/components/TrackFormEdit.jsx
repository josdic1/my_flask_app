import { useState, useEffect } from "react"

function TrackFormEdit({ initialData, onSave }) {
    const [ formData, setFormData ] = useState({
        track: "",
        artist: "",
        genre: "",
    });

    // Use a useEffect hook to populate the form with existing data
    useEffect(() => {
        if (initialData) {
            setFormData({
                track: initialData.track || "",
                artist: initialData.artist || "",
                genre: initialData.genre || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
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