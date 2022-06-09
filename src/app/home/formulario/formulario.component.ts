import { Component, ViewChild, OnInit} from '@angular/core';
import { MatTable} from '@angular/material/table';
import { Persona } from '../../interfaces/persona';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})

export class FormularioComponent implements OnInit {

  //Propiedades formulario
  contactForm: FormGroup;
  opcionesSexo: string[] = ['Hombre', 'Mujer', 'Otro', 'No especificado'];
  nuevoContacto: Persona = {nombre: '', apellidos: '', edad: 0, dni: '', cumpleanos: new Date(), colorFavorito: '', sexo: ''};

  //Propiedades para la tabla
  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'edad', 'dni', 'cumpleanos', 'colorFavorito', 'sexo', 'acciones'];

  //Array con datos iniciales, es donde se van a guardar todos los contactos que creemos.
  listaContactos: Persona[] = [
    {nombre: 'Pilar', apellidos: 'Alcalde Toro', edad: 21, dni: '48451289Y', cumpleanos: new Date(2000,10,10), colorFavorito: 'Negro', sexo: 'Mujer'},
    {nombre: 'María', apellidos: 'Amaya Cala', edad: 42, dni: '34124551M', cumpleanos: new Date(1980,6,6), colorFavorito: 'Azul', sexo: 'Otro'},
    {nombre: 'Juan', apellidos: 'Vega Cruz', edad: 18, dni: '49784589L', cumpleanos: new Date(2004,4,4), colorFavorito: 'Violeta', sexo:'Hombre'}
  ];

  //Propiedad que guarda el indice del array, se usa en la edición del registro.
  index: number = this.listaContactos.length;

  //Propiedad para mostrar o esconder elementos
  mostrar: boolean = false;

  //En el constructor podemos dar valores iniciales al formulario, y también las validaciones de los campos.
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar){
     this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(125)]],
      dni: ['', [Validators.required, Validators.pattern('[0-9]{8}[a-zA-Z]{1}')]],
      cumpleanos: ['', [Validators.required]],
      colorFavorito: ['', [Validators.required, Validators.minLength(3)]],
      sexo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  //Envía los datos del nuevo contacto.
  onSubmit(formGroupDirectiva: FormGroupDirective): void {
    if(this.mostrar){
      this.listaContactos[this.index] = this.contactForm.value;
      this.mostrar = false;
    }else{
      this.nuevoContacto = this.contactForm.value;
      this.listaContactos.push(this.nuevoContacto);
    }

    this.table.renderRows();
    this.contactForm.reset();
    formGroupDirectiva.resetForm();
  }

  //Obtengo el contacto y lo guardo en el objeto nuevoContacto vacío, para poder editarlo.
  abrirParaEditar(index: number, mostrar: boolean): void{
    this.index = index;
    this.fb.group({
      nombre: this.contactForm.controls["nombre"].setValue(this.listaContactos[index].nombre),
      apellidos: this.contactForm.controls["apellidos"].setValue(this.listaContactos[index].apellidos),
      edad: this.contactForm.controls["edad"].setValue(this.listaContactos[index].edad),
      dni: this.contactForm.controls["dni"].setValue(this.listaContactos[index].dni),
      cumpleanos: this.contactForm.controls["cumpleanos"].setValue(this.listaContactos[index].cumpleanos),
      colorFavorito: this.contactForm.controls["colorFavorito"].setValue(this.listaContactos[index].colorFavorito),
      sexo: this.contactForm.controls["sexo"].setValue(this.listaContactos[index].sexo)
    });
    this.mostrar = mostrar;
  }

  //Al cancelar la ación de editar o de guardar, se limpia el formulario
  cancelar(formGroupDirectiva: FormGroupDirective){
    this.mostrar = false;
    this.contactForm.reset();
    formGroupDirectiva.resetForm();
  }

  //Función que recibe el número de indice del array, para eliminar un registro.
  eliminarContacto(index: number): void {
    if(confirm('¿Desea borrar el contacto '+ this.listaContactos[index].nombre + ' ' + this.listaContactos[index].apellidos + '?'))
    {
      this.listaContactos.splice(index, 1);
      this.snackBar.open('Contacto eliminado con exito', 'X', {duration: 4000, horizontalPosition: 'center', verticalPosition: 'bottom'});
      this.table.renderRows();
      this.mostrar = false;
      this.contactForm.reset();
    }
  }

}
