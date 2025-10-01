

function TrackItem({ track, onAddClick, onViewClick, onDeleteClick, onUpdateClick }) {
    const onClick = (e) => {
        const { name, id } = e.target;
            switch(name) {
                case 'view':
                    onViewClick(id)
                    break;
                case 'add':
                    onAddClick(id)
                    break;
                case 'update':
                    onUpdateClick(id)
                    break;
                case 'delete':
                    onDeleteClick(id)
                    break;
                default:
                    alert('button name does not exist 💀')
                    break;
        }}


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
                <button id={track.id} name='add' type="button" onClick={onClick}>Add Link</button>
            </td>
            <td>
                <button id={track.id} name='update' type="button" onClick={onClick}>Update</button>
            </td>
                                    <td>
                <button id={track.id} name='delete' type="button" onClick={onClick}>Delete</button>
            </td>
        
        </tr>
        </>
    );
}

export default TrackItem;