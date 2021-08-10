import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators'

import { PaisesService } from '../../services/paises-service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: [

  ]
})
export class SelectorPageComponent implements OnInit {


  miFormulario: FormGroup = this._fb.group(
    {
      region: ['', Validators.required],
      pais: ['', Validators.required],
      fronteras: ['', Validators.required]
    }
  )
  // Llenar selectores

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _ps: PaisesService
  ) { }

  ngOnInit(): void {

    this.regiones = this._ps.regiones;

    //          Cambio de región 
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(resp => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this._ps.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });
    // cambio de país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('fronteras')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this._ps.getPaisXcodigo(codigo)),
        // switchMap(country => this._ps.getPaisesPorCodigos(country?.borders!))
      )
      .subscribe(paises => {
        // this.fronteras = pais?.borders || [];        
        // this.fronteras = paises;
        this.cargando = false;
        console.log(paises);
        let objeto = JSON.stringify(paises);
        console.log(objeto);
        let paisSel = JSON.parse(objeto, function (k, v){
          if (k === "borders")
          {
           return v;
          console.log(paisSel);
          };
          if (k === "alpha3Code")
          {
           return v;
          console.log(paisSel);
          };


        })
        //  this.fronteras = pais?[0].values 
      });
    

  }
  guardar() {
    console.log(this.miFormulario.value);
  }

}
    // cuando cambie la región....

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region);
    //     this._ps.getPaisesPorRegion( region)
    //       .subscribe( paises => {
    //           console.log(paises);
    //           this.paises = paises;
    //       });
    //   })
 // voy a dejar mi código aquí abajo para depurarlo posteriormente...
