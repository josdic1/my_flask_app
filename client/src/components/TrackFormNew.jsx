import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import TrackContext from "../contexts/TrackContext"

function TrackFormNew() {
    const { addNewTrack } = useContext(TrackContext)
    const [ formData, setFormData ] = useState({
        track: "",
        artist: "",
        genre: "",
    })


    const onFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

   async function onSubmit(e) {
        e.preventDefault();
        if (!formData.track) {
            alert("Track title cannot be empty");
            return;
        } else {
            const newTrack = {
                ...formData
            }
            addNewTrack(newTrack)
            onClear()
        }
    }

    const onClear = () => {
        setFormData({
        track: "",
        artist: "",
        genre: "",
    })
    }

    return (
         <>
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="track">Track Title:</label>
                <input
                    type="text"
                    id="track"
                    name="track"
                    onChange={onFormChange}
                    value={formData.track}
                    placeholder="Enter track title..."
                />
            </div>
            <div>
                <label htmlFor="artist">Artist:</label>
                <input
                    type="text"
                    id="artist"
                    name="artist"
                    onChange={onFormChange}
                    value={formData.artist}
                    placeholder="Enter artist name..."
                />
            </div>
            <div>
                <label htmlFor="genre">Genre:</label>
                <input
                    type="text"
                    id="genre"
                    name="genre"
                    onChange={onFormChange}
                    value={formData.genre}
                    placeholder="Enter genre..."
                />
            </div>
            <button type="submit">Add Track</button>
        </form>
       </>
    )
}

export default TrackFormNew