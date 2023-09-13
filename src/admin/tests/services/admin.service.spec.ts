import { Test, TestingModule } from '@nestjs/testing';
import { AdminRepository } from '../../repository/admin.repository';
import { AdminService } from '../../services/admin.service';
import { HashService } from '../../../utils/hash/hash.service';
import { LoggerService } from '../../../utils/logger/WinstonLogger';
import { TokenService } from '../../../utils/token/services';

describe('AdminService',()=>{
    let adminService: AdminService
    beforeEach(async ()=>{
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                AdminService, 
                LoggerService,
                {
                    provide: HashService,
                    useValue:{} ,
                },
                {
                    provide: TokenService,
                    useValue:{} ,
                },
                {
                    provide: AdminRepository,
                    useValue:{} ,
                }
            ]
        }).compile()
        adminService = module.get<AdminService>(AdminService)
    })

    it('adminService should be defined', ()=>{
        expect(adminService).toBeDefined();
    })

})