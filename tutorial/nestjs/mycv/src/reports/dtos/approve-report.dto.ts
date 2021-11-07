import { Expose } from 'class-transformer';

export class ApproveReportDTO {
  @Expose()
  approved: boolean;
}
