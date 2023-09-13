import { env } from "src/env";

export const  AdminUsersSeedData =[
    {
        firstName: env.admin.firstName,
        lastName:env.admin.lastName,
        email:env.admin.email,
        password: env.admin.password
    }
]