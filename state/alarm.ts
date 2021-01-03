import { makeObservable, observable, computed, action } from 'mobx';
import { Dayjs } from 'dayjs';

const DEFAULT_TIME = 1000 * 60 * 60 * 7.5; // 7.5 hours

export enum AlarmStatus {
  waiting = 'waiting',
  ticking = 'ticking',
  ringing = 'ringing',
}

class Alarm {
  duration: number = DEFAULT_TIME;
  endTime: Dayjs | null = null;
  status: AlarmStatus = AlarmStatus.waiting;

  constructor() {
    makeObservable(this, {
      duration: observable,
      endTime: observable,
      setEndTime: action,
      setDuration: action,
      status: observable,
      setStatus: action,
    });
  }

  setEndTime(time: Dayjs | null) {
    this.endTime = time;
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setStatus(status: AlarmStatus) {
    this.status = status;
  }
}

export default new Alarm();
