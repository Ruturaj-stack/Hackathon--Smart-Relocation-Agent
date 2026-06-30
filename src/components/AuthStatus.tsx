import { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (user) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ""} className="w-9 h-9 rounded-full ring-1 ring-white/10" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white/80" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white truncate max-w-[120px]">{user.displayName}</span>
            <span className="text-[10px] text-zinc-500">Premium Plan</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 hover:text-red-400 transition-colors text-zinc-500"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white w-full py-2.5 rounded-lg text-xs font-bold transition-all border border-white/5"
    >
      <LogIn className="w-4 h-4" />
      Connect Profile
    </button>
  );
}
