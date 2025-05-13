import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { MatrixRain } from './MatrixRain';
import { supabase } from '../lib/supabase';

export const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, wave } = state;
  const totalScore = players.reduce((sum, player) => sum + (player?.score || 0), 0);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [topScores, setTopScores] = useState<Array<{ score: number; wave: number; user_email: string }>>([]);

  useEffect(() => {
    const fetchTopScores = async () => {
      const { data, error } = await supabase
        .from('highscores')
        .select('score, wave, user_email')
        .order('score', { ascending: false })
        .limit(5);

      if (!error && data) {
        setTopScores(data);
      }
    };

    fetchTopScores();
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: 'START_GAME' });
  };

  const saveHighScore = async (userId: string) => {
    const { error: scoreError } = await supabase
      .from('highscores')
      .insert([{ 
        user_id: userId,
        user_email: email,
        score: totalScore,
        wave,
        created_at: new Date()
      }]);

    if (scoreError) throw scoreError;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Handle login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        await saveHighScore(signInData.user.id);
        setSuccess('Score saved successfully!');
      } else {
        // Handle signup
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        if (signUpData.user) {
          await saveHighScore(signUpData.user.id);
          setSuccess('Score saved! Check your email to verify your account.');
        }
      }
      
      setShowAuth(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-over">
      <MatrixRain />
      <h1>Game Over</h1>
      <p>Player 1 Score: {players[0]?.score || 0}</p>
      {players[1] && <p>Player 2 Score: {players[1]?.score || 0}</p>}
      <p>Total Score: {totalScore}</p>
      <p>Waves Survived: {wave}</p>
      
      {topScores.length > 0 && (
        <div className="mt-4 mb-4">
          <h2 className="text-[#00ff00] text-xl mb-2">Top Scores</h2>
          <div className="flex flex-col gap-2">
            {topScores.map((score, index) => (
              <p key={index} className="font-mono">
                {index + 1}. {score.user_email.split('@')[0]} - {score.score} (Wave {score.wave})
              </p>
            ))}
          </div>
        </div>
      )}
      
      {!showAuth && (
        <div className="flex flex-col gap-4">
          <button onClick={handlePlayAgain}>Play Again</button>
          <button 
            onClick={() => {
              setShowAuth(true);
              setIsLogin(false);
            }}
            className="bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-lg cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
          >
            Save High Score
          </button>
        </div>
      )}

      {showAuth && (
        <form onSubmit={handleAuth} className="flex flex-col gap-4 w-full max-w-md">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-[#00ff00]">{success}</p>}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-black border-2 border-[#00ff00] text-[#00ff00] p-2 font-mono"
            required
            disabled={loading}
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-black border-2 border-[#00ff00] text-[#00ff00] p-2 font-mono"
            required
            disabled={loading}
            minLength={6}
          />
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className="relative"
              >
                {loading ? 'Saving...' : isLogin ? 'Login & Save' : 'Sign Up & Save'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAuth(false)}
                disabled={loading}
                className="bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-lg cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#00ff00] underline text-sm mt-2"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};