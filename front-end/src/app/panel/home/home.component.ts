import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/service/Usuario/usuario.service';
import { UsuarioPlacas } from 'src/app/models/usuario-placas.model';
import { DateAdapter } from '@angular/material/core';
import { HistoricoService } from 'src/app/service/Historico/historico.service';
import { HistorialResponse } from 'src/app/models/api-response.model';
import { Area } from '@antv/g2plot';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  usuario: any;
  public placas: string[] = [];
  seleccionUsuario: string = '';
  fechaInicio: Date = new Date;
  fechaFin: Date = new Date;
  private chart: Area | null = null;

  constructor(private usuarioService: UsuarioService, private _adapter: DateAdapter<any>, private historicoService: HistoricoService) {
    this._adapter.setLocale('es'); // Establece la localización, en este caso, español

    // Obtener el usuario desde el localStorage
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
            this.placas.push(element.usu_nombre);
        });
      },

      (error) =>{
        alert(error);
      }
    )
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico al salir del componente
    }
  }


  buscarHistorial(){
    let timeStampInicio = this.fechaATimestamp(this.fechaInicio.toLocaleString());
    let timeStampFin = this.fechaATimestamp(this.fechaFin.toLocaleString());

    this.historicoService.getHistorial(this.usuario.usu_token, this.seleccionUsuario, timeStampInicio, timeStampFin).subscribe(
      (response: HistorialResponse) =>{
        if(response.message == "Resultados cargados"){
          if (this.chart) {
            this.chart.destroy(); // Destruye el gráfico anterior si existe
          }
          const data = [] as { his_time: number, value: number, type: string }[];;
          
          // Recorrer los datos de la respuesta
          response.datos.forEach(item => {
          if (item.his_temperatura != null) {
            data.push({
              his_time: item.his_time,
              value: item.his_temperatura,
              type: 'Temperatura',
            });
          } 
          if (item.his_humedad != null) {
            data.push({
              his_time: item.his_time,
              value: item.his_humedad,
              type: 'Humedad',
            });
          }
        });

          //Grafico
          const chart = new Area('chart-container', {
            data: data,
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
          this.chart = chart;          
        }else{
          alert(response.message);
        }
      }
    )
  }


  fechaATimestamp(fechaStr: string): number {
    const fecha = new Date(fechaStr);
    return fecha.getTime();
  }
}
