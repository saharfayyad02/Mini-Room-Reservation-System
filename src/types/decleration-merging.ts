import ImageKit from "@imagekit/nodejs";
import { UserResponseDTO } from "src/modules/auth/dto/create-auth.dto";


export type EnvVariables = {
    JWT_SECRET: string;
    IMAGEKIT_PRIVATE_KEY: string;
    NODE_ENV: 'development' | 'production';
}

declare global  {
    namespace Express {

    namespace Multer {
        interface File extends ImageKit.Files.FileUploadResponse {} 
    }
     export interface Request {
        user?:UserResponseDTO['user']
    }
    }
    namespace NodeJs {
        interface ProcessEnv extends EnvVariables{}
    }
    interface BigInt {
        toJSON(): string;
    }
    
}

