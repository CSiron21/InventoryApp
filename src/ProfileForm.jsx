// ProfileForm.jsx
import { useState, useEffect } from 'react'
import supabase from './supabaseClient'

function ProfileForm({ user, onProfileUpdate }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  // Load existing username
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
      } else if (data) {
        setUsername(data.username || '')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user.id])

  // Save profile
  async function updateProfile(e) {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username })
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
    } else {
      alert('Profile updated successfully ✅')
      if (onProfileUpdate) {
        onProfileUpdate(data) // tell App the profile changed
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile}>
      <label>
        Username:{' '}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}

export default ProfileForm
