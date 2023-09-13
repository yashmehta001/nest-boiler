import { Injectable } from "@nestjs/common";
import { promises } from "dns";
import { AdminService } from "src/admin/services/admin.service";
import { LoggerService } from "src/utils/logger/winstonLogger";

@Injectable()
export class AppSeeder{
    constructor(
        private readonly adminService: AdminService,
        private readonly logger: LoggerService,
    ){}
    static logInfo = 'Database - Seed:';
    async seed():Promise<void>{
        this.logger.info(`${AppSeeder.logInfo} Seeding Initialized`);

        // Seed Admin Users
        await this.adminService.seedAdminUserGroup();


        this.logger.info(`${AppSeeder.logInfo} Seeding Completed`);
    }
}