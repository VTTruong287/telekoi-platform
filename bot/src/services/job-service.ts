import moment from 'moment';
import { sendDailyMsg } from '../utils/common';

export class JobService {
  private _tick: Function;
  private _lastGreet?: moment.Moment;

  constructor () {
    this._tick = this.tick.bind(this);
    this._lastGreet = undefined;
  }

  public tick () {
    try {
      const lastGreetMoment = this._lastGreet ? this._lastGreet : moment(0);
      const now = moment().utc();
// console.log('tick: ', now, now.diff(lastGreetMoment))
      if (now.diff(lastGreetMoment) > 12 * 3600 * 1000 && now.hour() === 7) {
      // if (now.diff(lastGreetMoment) > 30 * 1000) {
        sendDailyMsg()
        
        this._lastGreet = now;
      }
    } catch (ex) {
      console.error(ex);
    }
    setTimeout(this._tick, 60 * 1000);
  }
}
