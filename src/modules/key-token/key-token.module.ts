import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KeyToken, KeyTokenSchema } from './key-token.model';
import { KeyTokenService } from './key-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KeyToken.name,
        schema: KeyTokenSchema,
      },
    ]),
  ],
  providers: [KeyTokenService],
  exports: [KeyTokenService],
})
export class KeyTokenModule {}
