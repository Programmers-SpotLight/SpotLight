import winston from 'winston';
import 'winston-daily-rotate-file';


const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transport = new winston.transports.DailyRotateFile({
  filename: './.logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '100m',
  maxFiles: '30d',
  utc: true,
});

transport.on('rotate', function (oldFilename, newFilename) {
  console.log('log file has been rotated');
});

const logger = winston.createLogger({
  level: 'info',
  format,
  defaultMeta: { service: 'user-service' },
  transports: [
    transport,
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;