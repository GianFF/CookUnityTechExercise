const { restoreMocks } = require('../restore-mocks');
const { newLogger } = require('../../src/logger');

describe('logger', () => {
  let writtenMessage;
  let logger;
  let message;
  let consoleLogSpy;

  beforeEach(() => {
    restoreMocks();

    const transactionID = '1';
    logger = newLogger(transactionID);
    message = 'My message';
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation((messageToLog) => {
      writtenMessage = messageToLog;
    });
  });

  describe('log', () => {
    describe('writes a message to the STDOUT containing', () => {
      const subject = () => {
        logger.log(message);
      };

      test('a timestamp', () => {
        subject();

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(writtenMessage.includes(logger.timestamp)).toBe(true);
      });

      test('a transactionID', () => {
        subject();

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(writtenMessage.includes(logger.transactionID)).toBe(true);
      });

      test('an empty transactionID if it was not specified', () => {
        logger = newLogger();
        subject();

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(writtenMessage.includes('-  -')).toBe(true);
      });

      test('a message', () => {
        subject();

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(writtenMessage.includes(message)).toBe(true);
      });
    });
  });
});
