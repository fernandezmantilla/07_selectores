import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { PaisSmall, Pais } from '../interfaces/paises.interface';


@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _rutaUrl: string = 'https://restcountries.eu/rest/v2/';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _rutaRegion: string ='region/';
  private _opcQryRegion: string = '?fields=alpha3Code;name';

  get regiones(): string[] {
    return [...this._regiones];
  }
  constructor(
    private _http: HttpClient
  ) { }
// Esta función no tiene errores....

    getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
      const url: string = 
        this._rutaUrl+this._rutaRegion +region+this._opcQryRegion;
      return this._http.get<PaisSmall[]>( url );
 // https://restcountries.eu/rest/v2/region/americas?fields=alpha3Code;name

    }
// Esta tambien hace lo esperado...
    getPaisXcodigo(codigo: string): Observable<Pais[] | null>{
      if (!codigo) { return of(null) };
      const url: string = 
        this._rutaUrl+'alpha/'+codigo;
// también podría ser: `${this._rutaUrl}/alpha/${codigo}`;        
      return this._http.get<Pais[]>( url );      
    }

    getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
      const url = `${ this._rutaUrl }alpha/${ codigo } ${this._opcQryRegion}`;
      return this._http.get<PaisSmall>( url );
    }
  
    getPaisesPorCodigos( borders: string[] ):  Observable<PaisSmall[]> {
  
      if ( !borders ) {
        return of([]);
      }
  
      const peticiones: Observable<PaisSmall>[] = [];
  
      borders.forEach( codigo => {
        const peticion = this.getPaisPorCodigoSmall(codigo);
        peticiones.push( peticion );
      });
      return combineLatest( peticiones);
    }

}
