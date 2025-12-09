import ImageKit from "@imagekit/nodejs";
import { FactoryProvider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvVariables } from "src/types/decleration-merging";

export const ImageKitToken = "ImageKitProvider";
export const imageKitProvider:FactoryProvider = {
    provide: ImageKitToken,
    useFactory:(configService:ConfigService<EnvVariables>)=>{
          return new ImageKit({
             privateKey:configService.getOrThrow('IMAGEKIT_PRIVATE_KEY'),
          })

    },
    inject:[ConfigService],
};