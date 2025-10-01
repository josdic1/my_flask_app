

function TrackLinkItem({ trackLink, onViewClick }) {
    const onClick = (e) => {
        const { name, id } = e.target;
        if (name === "view") {
            onViewClick(id);
        } else {
            alert('button name does not exist 💀');
        }
    };

    return (
        <>
        <tr id={trackLink.id}>
            <td>{trackLink.track_id}</td>
            <td>{trackLink.link_type}</td>
            <td>{trackLink.link_url}</td>
            <td>{trackLink.id}</td>
            <td>
                <button id={trackLink.id} name='view' type="button" onClick={onClick}>view</button>
            </td>
        </tr>
        </>
    );
}

export default TrackLinkItem;