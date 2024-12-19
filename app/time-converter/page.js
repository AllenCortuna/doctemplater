"use client";
import { useState } from 'react';

const TimeConverter = () => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [result, setResult] = useState('');

  const convertHours = (hours) => {
    const hoursNum = parseInt(hours);
    if (hoursNum >= 33) {
      alert('Maximum of 4 Working Days');
      return 0;
    }
    
    const conversionTable = {
      1: 0.125, 2: 0.25, 3: 0.375, 4: 0.5,
      5: 0.625, 6: 0.75, 7: 0.875, 8: 1.0,
      9: 1.125, 10: 1.25, 11: 1.375, 12: 1.5,
      13: 1.625, 14: 1.75, 15: 1.875, 16: 2.0,
      17: 2.125, 18: 2.25, 19: 2.375, 20: 2.5,
      21: 2.625, 22: 2.75, 23: 2.875, 24: 3.0,
      25: 3.125, 26: 3.25, 27: 3.375, 28: 3.5,
      29: 3.625, 30: 3.75, 31: 3.875, 32: 4.0
    };

    return conversionTable[hoursNum] || 0;
  };

  const convertMinutes = (minutes) => {
    const minutesNum = parseInt(minutes);
    if (minutesNum >= 61) {
      alert('Maximum of 60 minutes');
      return 0;
    }

    const conversionTable = {
      1: 0.002, 2: 0.004, 3: 0.006, 4: 0.008, 5: 0.01,
      6: 0.012, 7: 0.015, 8: 0.017, 9: 0.019, 10: 0.021,
      11: 0.023, 12: 0.025, 13: 0.027, 14: 0.029, 15: 0.031,
      16: 0.033, 17: 0.035, 18: 0.037, 19: 0.04, 20: 0.042,
      21: 0.044, 22: 0.046, 23: 0.048, 24: 0.05, 25: 0.052,
      26: 0.054, 27: 0.056, 28: 0.058, 29: 0.06, 30: 0.062,
      31: 0.065, 32: 0.067, 33: 0.069, 34: 0.071, 35: 0.073,
      36: 0.075, 37: 0.077, 38: 0.079, 39: 0.081, 40: 0.083,
      41: 0.085, 42: 0.087, 43: 0.09, 44: 0.092, 45: 0.094,
      46: 0.096, 47: 0.098, 48: 0.1, 49: 0.102, 50: 0.104,
      51: 0.106, 52: 0.108, 53: 0.11, 54: 0.112, 55: 0.115,
      56: 0.117, 57: 0.119, 58: 0.121, 59: 0.123, 60: 0.125
    };

    return conversionTable[minutesNum] || 0;
  };

  const handleCompute = () => {
    try {
      const convertedHours = convertHours(hours);
      const convertedMinutes = convertMinutes(minutes);
      const total = (convertedHours + convertedMinutes).toFixed(3);
      setResult(total.toString());
    } catch (error) {
      alert('Invalid Input');
      handleReset();
    }
  };

  const handleReset = () => {
    setHours('0');
    setMinutes('0');
    setResult('');
  };

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[21rem] m-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            Time Converter
          </h2>
          
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Hours
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => handleNumberInput(e, setHours)}
                className="custom-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Minutes
              </label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => handleNumberInput(e, setMinutes)}
                className="custom-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Result
              </label>
              <input
                type="text"
                value={result}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCompute}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Compute
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;