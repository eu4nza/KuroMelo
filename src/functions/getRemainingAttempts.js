module.exports = function getRemainingAttempts(attempt) {
    const attemptsLeft = 3 - attempt;
    if (attemptsLeft === 2) {
        return 'you have 2 attempts left.';
    } else if (attemptsLeft === 1) {
        return 'you have 1 attempt left.';
    }
}