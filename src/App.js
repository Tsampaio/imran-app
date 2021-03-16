import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [apiUsers, setApiUSers] = useState({
    loading: false,
    users: [],
  });
  const [list, setList] = useState({
    currentUser: {
      name: '',
      email: '',
    },
    allUsers: [],
  });
  const [error, setError] = useState();
  const [sortOrder, setSortOrder] = useState(true);

  const fectUsers = async () => {
    setApiUSers({
      ...apiUsers,
      loading: true,
    });

    const response = await axios.get(
      'https://8ee41f94-d4f4-439d-8233-e573edca74ff.mock.pstmn.io/users'
    );
    setApiUSers({
      loading: false,
      users: response.data.data,
    });
  };

  useEffect(() => {
    fectUsers();
  }, []);

  const displayApiUsers = apiUsers.users.map((user, index) => {
    return (
      <React.Fragment key={index}>
        <li>
          Name: {user.name} <br /> Email: {user.email}
        </li>
        <hr />
      </React.Fragment>
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(list.currentUser);
    canUserBeAddedToList(list.currentUser.email);

    if (canUserBeAddedToList(list.currentUser.email)) {
      setList({
        currentUser: {
          name: '',
          email: '',
        },
        allUsers: [...list.allUsers, list.currentUser],
      });
    } else {
    }
  };

  const setCurrentUser = (e) => {
    if (error) {
      setError('');
    }
    setList({
      ...list,
      currentUser: {
        ...list.currentUser,
        [e.target.name]: e.target.value,
      },
    });
  };

  const allUsers = list.allUsers.map((user, index) => {
    return (
      <li key={index}>
        <>
          Name: {user.name} <br /> Email: {user.email}
          <hr />
        </>
      </li>
    );
  });

  const canUserBeAddedToList = (email) => {
    console.log(typeof email);
    const foundUserInApi = apiUsers.users.find((user) => {
      return user.email === email;
    });

    const foundUserInMyList = list.allUsers.find((user) => {
      return user.email === email;
    });

    if (foundUserInApi && !foundUserInMyList) {
      return true;
    } else if (!foundUserInApi) {
      setError('User is not in the API list');
      return false;
    } else {
      setError('User is already in my list');
      return false;
    }
  };

  const sortUsers = (ascendingOrder) => {
    const usersSorted = list.allUsers.sort(function(a, b){
      if(ascendingOrder) {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
      } else {
        if(a.name > b.name) { return -1; }
        if(a.name < b.name) { return 1; }
      }
      return 0;
    })

    setList({
      ...list,
      allUsers: [...usersSorted]
    })

    setSortOrder(!sortOrder);
    
  }

  console.log(allUsers.length)

  return (
    <div className="container">
      <div className="col">
        <div className="card">
          <h2 className="title">Add new users</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="userName">User name:</label>
            <br />
            <input
              required
              id="userName"
              type="text"
              name="name"
              onChange={setCurrentUser}
              value={list.currentUser.name}
            />
            <br />
            <label htmlFor="userEmail">User email:</label>
            <br />
            <input
              required
              id="userEmail"
              type="email"
              name="email"
              onChange={setCurrentUser}
              value={list.currentUser.email}
            />
            <br />
            <button className="btn" type="submit">Add user</button>
          </form>
          {error && <h3 className="error">{error}</h3>}
        </div>
        <div className="card">
          <div className="sortDiv">
            <h2 className="title">My list:</h2>
            { allUsers.length > 0 &&
              <button className="btn" onClick={() => sortUsers(sortOrder)}>
                Sort users by name:
              </button>
            }
          </div>
          <ul className="apiList">{allUsers.length < 1 ? (
            <li><b>No users in the list</b></li>
            ) : allUsers }
          </ul>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <h2 className="title">Api Users:</h2>
          <ul className="apiList">
            {apiUsers.loading ? <li>Loading...</li> : displayApiUsers}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
