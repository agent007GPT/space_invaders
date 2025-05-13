import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { MatrixRain } from './MatrixRain';
import { supabase } from '../lib/supabase';

export const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, wave } = state;
  const totalScore = players.reduce((sum, player) => sum + (player?.score || 0), 0);
  
  const [playerName, setPlayerName] = useState('');
  const [showSaveScore, setShowSaveScore] = useState(false);
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

  const saveHighScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: scoreError } = await supabase
        .from('highscores')
        .insert([{ 
          user_email: playerName,
          score: totalScore,
          wave,
          created_at: new Date()
        }]);

      if (scoreError) throw scoreError;
      
      setSuccess('Score saved successfully!');
      setShowSaveScore(false);
      
      // Refresh top scores
      const { data } = await supabase
        .from('highscores')
        .select('score, wave, user_email')
        .order('score', { ascending: false })
        .limit(5);

      if (data) {
        setTopScores(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-over">
      <MatrixRain />
      <div className="game-over-content max-h-[80vh] overflow-y-auto p-4 flex flex-col items-center">
        <h1 className="text-xl mb-2">Game Over</h1>
        <p className="text-sm mb-1">Player 1 Score: {players[0]?.score || 0}</p>
        {players[1] && <p className="text-sm mb-1">Player 2 Score: {players[1]?.score || 0}</p>}
        <p className="text-sm mb-1">Total Score: {totalScore}</p>
        <p className="text-sm mb-2">Waves Survived: {wave}</p>
        
        {topScores.length > 0 && (
          <div className="mt-2 mb-2">
            <h2 className="text-[#00ff00] text-base mb-1">Top Scores</h2>
            <div className="flex flex-col gap-1">
              {topScores.map((score, index) => (
                <p key={index} className="font-mono text-xs">
                  {index + 1}. {score.user_email} - {score.score} (Wave {score.wave})
                </p>
              ))}
            </div>
          </div>
        )}
        
        {!showSaveScore && (
          <div className="flex flex-col gap-2 mt-2">
            <button onClick={handlePlayAgain}>Play Again</button>
            <button 
              onClick={() => setShowSaveScore(true)}
              className="bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-sm cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
            >
              Save High Score
            </button>
          </div>
        )}

        {showSaveScore && (
          <form onSubmit={saveHighScore} className="flex flex-col gap-2 w-full max-w-md mt-2">
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {success && <p className="text-[#00ff00] text-xs">{success}</p>}
            
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="bg-black border-2 border-[#00ff00] text-[#00ff00] p-2 font-mono outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] w-full text-sm"
              style={{
                caretColor: '#00ff00',
                zIndex: 100,
                position: 'relative'
              }}
              required
              disabled={loading}
              maxLength={20}
            />
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={loading}
                className="relative bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-sm cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
              >
                {loading ? 'Saving...' : 'Save Score'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowSaveScore(false)}
                disabled={loading}
                className="bg-transparent border-2 border-[#00ff00] text-[#00ff00] px-8 py-2 text-sm cursor-pointer transition-all hover:bg-[#00ff00] hover:text-black font-mono"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};