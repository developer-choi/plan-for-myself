import {HttpStatus, type INestApplication} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';

export function setupOpenApi(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('plan-for-myself API')
    .setDescription('웹과 앱이 같이 쓰는 공부 기록 API. 에러는 모두 {code, message}로 온다')
    .setVersion('1.0')
    .addGlobalResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: '예상하지 못한 서버 에러',
      schema: {
        type: 'object',
        required: ['code', 'message'],
        properties: {code: {type: 'string', example: API_ERROR_CODES.INTERNAL_ERROR}, message: {type: 'string'}},
      },
    })
    .build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));
}
