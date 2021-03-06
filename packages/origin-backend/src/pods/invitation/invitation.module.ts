import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { InvitationController } from './invitation.controller';
import { Invitation } from './invitation.entity';
import { InvitationService } from './invitation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Invitation]), UserModule, CqrsModule, OrganizationModule],
    providers: [InvitationService],
    controllers: [InvitationController]
})
export class InvitationModule {}
