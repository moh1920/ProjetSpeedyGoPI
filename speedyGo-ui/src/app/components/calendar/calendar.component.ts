import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
} from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FullCalendarModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarComponent implements OnInit {
  calendarVisible = signal(true);
  currentEvents = signal<EventApi[]>([]);

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: (fetchInfo, successCallback, failureCallback) => {
      this.http.get<any[]>('http://localhost:8020/pv/calendarPV').subscribe({
        next: (data) => {
          const events = data.map(e => ({
            title: e.typeEV_ep,
            start: e.startDate,
            end: e.endDate,
            extendedProps: e
          }));
          successCallback(events);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des événements', err);
          failureCallback(err);
        }
      });
    }
  });

  constructor(
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  handleCalendarToggle() {
    this.calendarVisible.update(val => !val);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update(options => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Veuillez entrer un titre pour l’événement :');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Supprimer l’événement "${clickInfo.event.title}" ?`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
