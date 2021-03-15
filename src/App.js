import React, {useEffect, useState} from 'react'
import axios from 'axios';
import './App.css';

function App() {
  const [apiUsers, setApiUSers] = useState({
    loading: false,
    users: []
  });
  const [list, setList ] = useState({
    currentUser: {
      name: "",
      email: ""
    }, 
    allUsers: []
  });
  const [error, setError] = useState();

  const fectUsers = async () => {
    setApiUSers({
      ...apiUsers,
      loading: true
    })

    const response = await axios.get('https://8ee41f94-d4f4-439d-8233-e573edca74ff.mock.pstmn.io/users');
    setApiUSers({
      loading: false,
      users: response.data.data
    });
  }
  
  useEffect(() => {
    fectUsers();
  }, [])

  const displayApiUsers = apiUsers.users.map((user, index) => {
    return <li key={index}>Name: {user.name} / Email: {user.email}</li>
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(list.currentUser)
    canUserBeAddedToList(list.currentUser.email)
    
    if(canUserBeAddedToList(list.currentUser.email)) {
      setList({
        currentUser: {
          name: "", 
          email: ""
        },
        allUsers: [
          ...list.allUsers,
          list.currentUser
        ]
      })
    } else {

    }
  }

  const setCurrentUser = (e) => {
    if(error) {
      setError("")
    }
    setList({
      ...list,
      currentUser: {
        ...list.currentUser,
        [e.target.name]: e.target.value
      }
    })
  }

  const allUsers = list.allUsers.map((user, index) => {
    return <li key={index}>Name: {user.name} - Email: {user.email}</li>
  });

  const canUserBeAddedToList = (email) => {
    console.log(typeof email);
    const foundUserInApi = apiUsers.users.find(user => {
      return user.email === email
    })

    const foundUserInMyList = list.allUsers.find(user => {
      return user.email === email
    })

    if(foundUserInApi && !foundUserInMyList) {
      return true
    } else if(!foundUserInApi) {
      setError("User is not in the API list")
      return false
    } else {
      setError("User is already in my list")
      return false
    }
  }

  return (
    <div className="container">
      <div className="col">
        <h2>My list</h2>
        <form onSubmit={handleSubmit}> 
          <label htmlFor="userName">User name:</label><br />
          <input 
            id="userName" 
            type="text" 
            name="name" 
            onChange={setCurrentUser}
            value={list.currentUser.name}  
          /><br />
          <label htmlFor="userEmail">User email:</label><br />
          <input 
            id="userEmail" 
            type="email" 
            name="email" 
            onChange={setCurrentUser}
            value={list.currentUser.email} 
          /><br />
          <button type="submit">Add user</button>
        </form>
        {error && <h3>{error}</h3>}
        <h2>All Users</h2>
        <ul>
          {allUsers}
        </ul>
      </div>
      <div className="col">
        <h2>Api Users</h2>
        <ul>
          {apiUsers.loading ? (
            <li>Loading...</li>
          ): displayApiUsers}
        </ul>
      </div>
    </div>
  );
}

export default App;
