import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { env } from '../config/env';
import { MODEL_DEFINITIONS } from './schemas';

/** MongoDB ulanishi va barcha modellar — butun ilova bo'ylab mavjud (@Global) */
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: env.MONGODB_URI,
        serverSelectionTimeoutMS: 10_000,
        connectionFactory: (connection: Connection) => {
          const log = new Logger('MongoDB');
          const ok = () => log.log(`✅ Ulandi: ${connection.host}/${connection.name}`);
          if (connection.readyState === 1) ok();
          else connection.once('connected', ok);
          connection.on('error', (e) => log.error(`❌ ${e.message} — MONGODB_URI ni tekshiring`));
          return connection;
        },
      }),
    }),
    MongooseModule.forFeature(MODEL_DEFINITIONS),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
