

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom";
import TrackLinkContext from "../contexts/TrackLinkContext";

function TrackLinkFormEdit() {

    const { id } = useParams()
    const [ formData, setFormData ] = useState({
        link_type: "",
        link_url: "",
        track_id: ""
    });
    const { trackLinks, updateTrackLink } = useContext(TrackLinkContext)

    const navigate = useNavigate()

useEffect(() => {
  const updating = trackLinks.find(tl => Number(tl.id) === Number(id));
  if (updating) {
    setFormData({
      id: updating.id,   
      link_type: updating.link_type,
      link_url: updating.link_url,
      track_id: updating.track_id
    });
  }
}, [id, trackLinks]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

const handleSubmit = (e) => {
  e.preventDefault();
  updateTrackLink(formData); 
  clearForm();
  navigate(`/tracks/${formData.track_id}`);
};

    function clearForm() {
        setFormData({
        link_type: "",
        link_url: ""
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="link_type">Link type:</label>
                <input
                    type="text"
                    id="link_type"
                    name="link_type"
                    value={formData.link_type}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="link_url">Link Url:</label>
                <input
                    type="text"
                    id="link_url"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default TrackLinkFormEdit;