import { JobService } from './job-service';

class ServiceLocator {
  private _jobService: JobService;

  constructor () {
    this._jobService = new JobService();
  }

  public get jobService () {
    return this._jobService;
  }
}

export const serviceLocator = new ServiceLocator();
