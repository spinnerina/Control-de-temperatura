import { Component, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Area } from '@antv/g2plot';
import { map } from 'rxjs/operators';
import { UsuarioService } from 'src/app/service/Usuario/usuario.service';
import { UsuarioPlacas } from 'src/app/models/usuario-placas.model';

@Component({
  selector: 'app-tiempo-real',
  templateUrl: './tiempo-real.component.html',
  styleUrls: ['./tiempo-real.component.css']
})
export class TiempoRealComponent implements OnInit {
  private socket$: WebSocketSubject<any> = webSocket('ws://localhost:3000');;
  usuario: any;
  public placas: number[] = [];
  seleccionPlaca: string = '';
  constructor(private usuarioService: UsuarioService){
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      this.usuario = JSON.parse(usuarioString);
    }
  }

  ngOnInit(): void {

    this.usuarioService.getUsuario(this.usuario.usu_token).subscribe(
      (response: UsuarioPlacas) =>{
        console.log(response);
        response.data.forEach(element => {
            this.placas.push(element.pla_id);
        });
      },

      (error) =>{
        alert(error);
      }
    )



    console.log('Conexion establecida');

    const chart = new Area('chart-container', {
      data: [], // Inicialmente, no hay datos
      xField: 'his_time',
      yField: 'value',
      seriesField: 'type',
      xAxis: {
        title: {
          text: 'Fecha',
        },
        tickCount: 5,
      },
      yAxis: {
        title: {
          text: 'Valor',
        },
      },
      color: ['#1976D2', '#FFC107'], // Colores para las dos series
      legend: {
        position: 'top-right', // Ubicación de la leyenda
      },
    });

    chart.render();

    // Escucha eventos desde el servidor WebSocket y transforma los datos
    this.socket$.pipe(
      map((message) => {
        if(message.pla_id === this.seleccionPlaca){
        return [
          { his_time: message.his_time, value: message.his_temperatura, type: 'Temperatura' },
          { his_time: message.his_time, value: message.his_humedad, type: 'Humedad' },
        ];
      }else{
        return [];
      }
      })
    ).subscribe(
      (transformedData) => {
        if (transformedData.length > 0) {
          chart.changeData([...chart.options.data, ...transformedData]);
        }
      },
      (error) => {
        console.error('Error en la conexión WebSocket:', error);
      }
    );
  }
}
