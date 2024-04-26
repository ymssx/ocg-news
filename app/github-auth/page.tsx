'use client';
import { useState } from 'react';
import { getAuth, setAuth } from '@/components/e-components/core/auth';

export default () => {
  const auth = getAuth();
  const [name, setName] = useState(auth.name || '');
  const [token, setToken] = useState(auth.token || '');

  const handleSubmit = () => {
    setAuth(
      name,
      token,
    );
    window.close();
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-[600px]">
      <input value={name} onInput={e => setName((e.target as any)?.value)} className="bg-gray-100 px-3 py-1" />
      <input value={token} onInput={e => setToken((e.target as any)?.value)} className="bg-gray-100 px-3 py-1" type="password" />
      <div className="mt-4">
        <button onClick={handleSubmit} className="w-full py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded-sm">授权</button>
      </div>
    </div>
  );
}