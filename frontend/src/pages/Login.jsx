import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { userService } from '../services/user'
import { login } from '../store/user.actions'
import { StayIndexHeader } from '../cmps/StayIndexHeader.jsx'

import '../assets/styles/pages/Login.scss'

// export function Login() {
// LoginSignupModal
  export function Login({onComplete}) {
  const [users, setUsers] = useState([])
  const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
  const navigate = useNavigate()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const users = await userService.getUsers()
    setUsers(users)
  }

  async function onLogin(ev = null) {
    if (ev) ev.preventDefault()
    if (!credentials.username) return
    await login(credentials)
    // navigate('/')
    // LoginSignupModal
    if (onComplete) onComplete()
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  return (
    // <main className='login-page'>
    <div className='login-page'>
      <div className='header'>
        {/* <StayIndexHeader /> */}
      </div>

      <section className='login-container'>
        <div className='login-box'>
          <h1>Welcome back</h1>
          <h2>Login to your Restbnb account</h2>

          <form className='login-form' onSubmit={onLogin}>
            {/* <label htmlFor='userSelect'>Choose a user</label> */}
            <select id='userSelect' name='username' value={credentials.username} onChange={handleChange}>
              <option value=''>Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user.username}>
                  {user.fullname}
                </option>
              ))}
            </select>

            <button type='submit'>Continue</button>
          </form>

          {/* Future implementation:
          <p>Don't have an account? <a href='/signup'>Sign up</a></p>
          */}
        </div>
      </section>
      {/* </main> */}
      </div>
  )
}
