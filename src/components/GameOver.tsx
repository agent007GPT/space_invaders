import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MatrixRain } from './MatrixRain';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, wave } = state;
  const totalScore = players.reduce((sum, player) => sum + (player?.score || 0), 0);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePlayAgain = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const { error: scoreError } = await supabase
        .from('highscores')
        .insert([{ 
          user_email: email,
          score: totalScore,
          wave,
          created_at: new Date()
        }]);

      if (scoreError) throw scoreError;

      setSuccess('Score saved! Check your email to verify your account.');
      setShowSignup(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="game-over">
      <MatrixRain />
      <h1>Game Over</h1>
      <p>Player 1 Score: {players[0]?.score || 0}</p>
      <p>Player 2 Score: {players[1]?.score || 0}</p>
      <p>Total Score: {totalScore}</p>
      <p>Waves Survived: {wave}</p>
      
      {!showSignup && (
        <div className="flex flex-col gap-4">
          <button onClick={handlePlayAgain}>Play Again</button>
          <button 
            onClick={() => setShowSignup(true)}
            className="bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-lg cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
          >
            Save High Score
          </button>
        </div>
      )}

      {showSignup && (
        <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full max-w-md">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-[#00ff00]">{success}</p>}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-black border-2 border-[#00ff00] text-[#00ff00] p-2 font-mono"
            required
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-black border-2 border-[#00ff00] text-[#00ff00] p-2 font-mono"
            required
          />
          
          <div className="flex gap-4">
            <button type="submit">Save Score</button>
            <button 
              type="button" 
              onClick={() => setShowSignup(false)}
              className="bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-lg cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};