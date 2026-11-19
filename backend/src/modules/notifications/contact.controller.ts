import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { ContactMessageDto } from './dto/contact-message.dto';
import { EmailService } from './email.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly email: EmailService) {}

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async send(@Body() data: ContactMessageDto) {
    await this.email.sendContactMessage(data);
    return { sent: true };
  }
}
