import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import WithAuth from './withAuth';

const Home = () => {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [wpm, setWpm] = useState(null);
  const [raw, setRaw] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [consistency, setConsistency] = useState(null);

  const [isFinished, setIsFinished] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  const text = "Assalomu alaykum";

  const API = import.meta.env.VITE_API;

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());

    if (input.length === text.length && !isFinished) {
      const end = Date.now();
      setEndTime(end);

      const duration = (end - startTime) / 1000;
      const words = text.trim().split(/\s+/).length;
      const wpmCalc = Math.round((words / duration) * 60);

      const correctChars = text.split('').filter((c, i) => c === input[i]).length;
      const consistencyCalc = Math.round((correctChars / input.length) * 100);
      const accuracyCalc = Math.round((correctChars / text.length) * 100);

      setWpm(wpmCalc);
      setRaw(Math.round((correctChars / text.length) * 100));
      setAccuracy(accuracyCalc);
      setConsistency(consistencyCalc);
      setIsFinished(true);

      submitResult(end, startTime, wpmCalc, Math.round((correctChars / text.length) * 100), accuracyCalc, consistencyCalc);
    }
  }, [input]);

  useEffect(() => {
    const handleKey = (e) => {
      if (isFinished) return;
      e.preventDefault();

      if (!startTime && e.key.length === 1) {
        setStartTime(Date.now());
      }

      if (e.key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setInput((prev) => prev + e.key);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFinished, startTime]);

  const submitResult = async (end, start, wpmCalc, rawCalc, accuracyCalc, consistencyCalc) => {
    setLoading(true);
    const ID = localStorage.getItem('id');
    if (!ID) {
      setLoading(false);
      return message.error("Foydalanuvchi ID topilmadi!");
    }
    try {
      const duration = (end - start) / 1000;
      const body = { wpm: wpmCalc, raw: rawCalc, accuracy: accuracyCalc, consistency: consistencyCalc, time: duration };
      await axios.post(
        `${API.replace(/\/$/, '')}/api/results/${ID}`,
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      message.success('Natijangiz yuborildi!');
      setShowResults(true);
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCharClass = (i) => {
    if (input[i] === undefined) return 'text-gray-500';
    if (text[i] === ' ' && input[i] !== ' ') return 'text-red-500';
    return input[i] === text[i] ? 'text-white' : 'text-red-500';
  };

  const handleBack = () => {
    localStorage.removeItem('id');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#323437] flex items-center justify-center">
      {!showResults ? (
        <div className="max-w-7xl bg-[#323437] text-white rounded-xl p-8">
          <h1 className="text-4xl font-semibold text-center text-yellow-400">Typing Test</h1>

          <p className="mb-4 text-gray-100 whitespace-pre-wrap p-4 rounded-md bg-[#323437] text-2xl leading-relaxed font-medium">
            {text.split('').map((char, i) => (
              <span key={i} className={getCharClass(i)}>{char}</span>
            ))}
          </p>
        </div>
      ) : (
        <div className="max-w-8xl m-auto space-y-8 bg-[#323437] text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-medium text-yellow-400 mb-6">{"Sizning typing bo'yicha topshirgan test natijangiz!"}</h2>
          <div className='grid grid-cols-5 items-center justify-center gap-5'>
            <p className="text-3xl mb-1 border border-yellow-400 p-3 rounded-xl flex flex-col">Time: <b>{((endTime - startTime) / 1000).toFixed(2)} s</b></p>
            <p className="text-3xl mb-1 border border-yellow-400 p-3 rounded-xl flex flex-col">WPM: <b>{wpm}</b></p>
            <p className="text-3xl mb-1 border border-yellow-400 p-3 rounded-xl flex flex-col">Raw: <b>{raw}</b></p>
            <p className="text-3xl mb-1 border border-yellow-400 p-3 rounded-xl flex flex-col">Consistency: <b>{consistency}%</b></p>
            <p className="text-3xl mb-1 border border-yellow-400 p-3 rounded-xl flex flex-col">Accuracy: <b>{accuracy}%</b></p>
          </div>
          <div className='w-[30%] mx-auto'>
            <Button
              style={{
                background: '#FDC700',
                color: 'black',
                borderRadius: '8px',
                padding: '18px 0',
              }}
              onClick={handleBack}
              type='primary'
              htmlType="submit"
              block
              loading={loading}
            >
              Yuborish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithAuth(Home);