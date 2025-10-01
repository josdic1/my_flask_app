

function TrackItem({ track, onAddLinkClick, onViewClick }) {
    const onClick = (e) => {
        const { name, id } = e.target;
        if (name === "view") {
            onViewClick(id);
        } else {
            if(name=="addLink") {
             onAddLinkClick(id)
        } else {
            alert('button name does not exist 💀');
        }}
    };

    return (
        <>
        <tr id={track.id}>
            <td>{track.id}</td>
            <td>{track.track}</td>
            <td>{track.artist}</td>
            <td>{track.genre}</td>
            <td>
                <button id={track.id} name='view' type="button" onClick={onClick}>view</button>
            </td>
                        <td>
                <button id={track.id} name='addLink' type="button" onClick={onClick}>Add Link</button>
            </td>
        </tr>
        </>
    );
}

export default TrackItem;