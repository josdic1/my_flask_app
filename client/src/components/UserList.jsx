import { useContext } from "react"
import UserContext from "../contexts/UserContext"
import UserItem from "./UserItem"


function UserList() {
    
const { users } = useContext(UserContext)

  if (!users || users.length === 0) {
    return <p>The users list is empty.</p>
  }

return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
            <UserItem key={u.id} user={u} />
        ))}
      </tbody>
    </table>
  )
}

export default UserList
