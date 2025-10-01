import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TrackLinkContext from "../contexts/TrackLinkContext";
import TrackLinkItem from "./TrackLinkItem";

function TrackLinkList() {
    const { trackLinks } = useContext(TrackLinkContext);
    const navigate = useNavigate();

    if (!trackLinks || trackLinks.length === 0) {
        return <p>The trackLinks list is empty.</p>;
    }

    function onViewClick(id) {
        navigate(`/trackLinks/${id}`);
    }

    return (
        <>
            <h3>Track Links</h3>
            <table>
                <thead>
                    <tr>
                        <th>TID</th>
                        <th>Type</th>
                        <th>Url</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((tl) => (
                        <TrackLinkItem
                            key={tl.id}
                            trackLink={tl}
                            onViewClick={onViewClick}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TrackLinkList;