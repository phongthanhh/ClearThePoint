export const getSecondsAnMillisecondsFirstDigit = (
    milliseconds: number
  ): { seconds: number; millisecondsFirstDigit: number } => {
    const seconds = Math.floor(milliseconds / 1000); // Full seconds
    const millisecondsFirstDigit = Math.floor((milliseconds % 1000) / 100); // First digit of milliseconds
  
    return { seconds, millisecondsFirstDigit };
  };