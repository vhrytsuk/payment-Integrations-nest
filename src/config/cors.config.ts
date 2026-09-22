import { ConfigService } from '@nestjs/config';

export function getCorsConfig(ConfigService: ConfigService) {
  const allowedOrigins =
    ConfigService.get<string>('HTTP_CORS_ORIGIN')
      ?.split(',')
      .map((origin) => origin.trim()) || [];

  return {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
}
