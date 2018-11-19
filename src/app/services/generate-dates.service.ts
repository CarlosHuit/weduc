import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateDatesService {

  constructor() { }

  generateData = () => {

    const d = new Date();

    const date = {
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      day:   d.getDate(),
    };


    const time = {
      hour:         d.getHours(),
      minutes:      d.getMinutes(),
      seconds:      d.getSeconds(),
      milliseconds: d.getMilliseconds()
    };

    const fullDate = `${date.year}/${date.month}/${date.day}`;
    const fullTime = `${time.hour}:${time.minutes}:${time.seconds}:${time.milliseconds}`;

    /* const time = `${fullDate} GTM-6 ${fullTime}` */

    return {
      date:     date,
      time:     d.getTime,
      fullDate: fullDate,
      fullTime: fullTime
    };

  }

  /* new Date('2018/10/03 GMT-6 08:30:20:999') */

}
