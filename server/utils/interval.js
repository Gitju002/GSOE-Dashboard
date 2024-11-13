export const TIME_INTERVALS = {
    EVERY_HOUR: '0 * * * *',      // Runs every hour
    EVERY_3_HOURS: '0 */3 * * *', // Runs every 3 hours
    EVERY_6_HOURS: '0 */6 * * *', // Runs every 6 hours
    EVERY_12_HOURS: '0 */12 * * *', // Runs every 12 hours
    EVERY_DAY_MIDNIGHT: '0 0 * * *', // Runs every day at midnight
    EVERY_MONDAY_9AM: '0 9 * * 1', // Runs every Monday at 9 AM
    EVERY_MINUTE: '* * * * *',     // Runs every minute
    EVERY_30_MINUTES: '*/30 * * * *', // Runs every 30 minutes
    EVERY_SUNDAY_MIDNIGHT: '0 0 * * 0' // Runs every Sunday at midnight
  };