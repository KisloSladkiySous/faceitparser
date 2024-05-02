import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { Subject, debounceTime, filter, interval, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
export interface ISocketResponce {

  deaths: string
  elo_now:number
  elo_per_match:number
  kd_ratio: string
  kills:string
  kr_ratio: string
  last_elo: number
  nickname: string
  player_id: string
  avatar: string
}
import { initFlowbite } from 'flowbite';
import { SocketService } from './core/socket.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AsyncPipe, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [  
        style({opacity:0}),
        animate(500, style({opacity:1})) 
      ]),
      transition(':leave', [  
        animate(500, style({opacity:0})) 
      ])
    ]),

  ]
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef)
  cdr = inject(ChangeDetectorRef)
  socketData$ = new Subject<ISocketResponce | null>();
  elo = signal(0)
  hidden = true
  perdezh!:any
  elo_change!:number
  constructor(private socket: SocketService) {
    this.socket.connect();
    this.socket
      .fromEvent<ISocketResponce>('update_data')
      .pipe(
        // filter((res) => res.nickname === String(this.route.snapshot.paramMap.get('id'))),
        tap((res) => {
          this.perdezh = res
          this.elo.set(Number(res.last_elo))
          console.log(res);
          
          this.socketData$.next(res)
          this.hidden = false
          let current_elo = signal(Number(res.elo_now))
          let sub = new Subject()
          console.log(this.perdezh);
          // [ngClass]="{'hidden': hidden}"
          this.cdr.detectChanges()
          
          interval(150).pipe(
            takeUntil(sub)
          ).subscribe(() => {
            if (this.elo() < current_elo()) {
              this.elo.update((res) => Number(res) + 1)
            } else {
              this.elo.update((res) => Number(res) - 1)
            }
            if (this.elo() === current_elo()) {
              sub.next(true)
            }
            // this.elo() !== current_elo() ? this.elo.update((res) => Number(res) + 1) : sub.next(true)
          })
          
        }),
        debounceTime(20000),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.hidden = true
        this.socketData$.next(null);
      });
  }
}
