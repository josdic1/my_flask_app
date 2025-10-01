import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TrackLinkContext from "../contexts/TrackLinkContext"
import TrackContext from "../contexts/TrackContext"

function TrackLinkFormNew() {
      const { addTrackLink } = useContext(TrackLinkContext)
  const { trackId } = useParams()  
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    link_type: "",
    link_url: "",
    track_id: trackId || ""   
  })

    const onFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function onSubmit(e) {
        e.preventDefault()
        if (!formData.link_type || !formData.link_url ) {
            alert('Track link type/url cannot be empty')
            return
        }

addTrackLink(formData)
    navigate(`/tracks/${trackId}`)  
    setFormData(prev => ({
      ...prev,
      link_type: "",
      link_url: ""
    }))
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
                    placeholder="Enter track link_type..."
                />
            </div>
            <div>
                <label htmlFor="link_url">Link Url:</label>
                <input
                    type="text"
                    id="link_url"
                    name="link_url"
                    onChange={onFormChange}
                    value={formData.link_url}
                    placeholder="Enter link_url..."
                />
            </div>
     <div>
        <label htmlFor="track_id">Track ID:</label>
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
    )
}

export default TrackLinkFormNew