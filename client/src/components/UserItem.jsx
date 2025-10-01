

function UserItem({ user }) {

return (
<>
<tr id={user.id}>
    <td>{user.id}</td>
    <td>{user.name}</td>
</tr>
</>
)}

export default UserItem
