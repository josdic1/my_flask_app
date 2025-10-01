

function TrackItem({ track, onViewClick }) {
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
        <tr id={track.id}>
            <td>{track.id}</td>
            <td>{track.track}</td>
            <td>{track.artist}</td>
            <td>{track.genre}</td>
            <td>
                <button id={track.id} name='view' type="button" onClick={onClick}>view</button>
            </td>
        </tr>
        </>
    );
}

export default TrackItem;