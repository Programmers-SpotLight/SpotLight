import winston from 'winston';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: 'info',
  format,
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: './.logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;