'use client';
import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersList() {
  
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          method: 'GET',
          headers: API_KEY ? { 'x-api-key': API_KEY } : {},
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || err.message || 'Gagal fetch users');
        }

        const data = await res.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
