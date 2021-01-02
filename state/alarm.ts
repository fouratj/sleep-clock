import { makeObservable, observable, computed, action } from 'mobx';
import { Dayjs } from 'dayjs';

const DEFAULT_TIME = 1000 * 60 * 60 * 7.5; // 7.5 hours

class Alarm {
  endTime: Dayjs | null = null;
  duration: number = DEFAULT_TIME;

  constructor() {
    makeObservable(this, {
      duration: observable,
      endTime: observable,
      setEndTime: action,
      setDuration: action,
    });
  }

  setEndTime(time: Dayjs | null) {
    this.endTime = time;
  }

  setDuration(duration: number) {
    this.duration = duration;
  }
}

export default new Alarm();
