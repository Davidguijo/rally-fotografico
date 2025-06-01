import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { GaleriaComponent } from './componentes/galeria/galeria.component';
import { PanelAdminComponent } from './componentes/panel-admin/panel-admin.component';
import { SubirFotoComponent } from './componentes/subir-foto/subir-foto.component';
import { AuthGuard } from './servicios/auth.guard';
import { MisFotosComponent } from './componentes/mis-fotos/mis-fotos.component';
import { EditarFotoComponent } from './componentes/editar-foto/editar-foto.component';
import { EditarUsuarioComponent } from './componentes/editar-usuario/editar-usuario.component';

export const routes: Routes = [
{
    path: "",
    component: HomeComponent
},
{
    path: "login",
    component: LoginComponent
},
{
    path: "registro",
    component: RegistroComponent
},
{
    path: "galeria",
    component: GaleriaComponent
},
{
  path: 'admin',
  component: PanelAdminComponent,
  canActivate: [AuthGuard],
  data: { expectedRole: 'administrador' }
},
{
  path: 'subir-foto',
  component: SubirFotoComponent,
  canActivate: [AuthGuard],
  data: { expectedRole: 'participante' }
},
{
  path: 'editar-foto/:id',
  component: EditarFotoComponent,
  canActivate: [AuthGuard],
  data: { expectedRole: 'participante' }
},
{
  path: 'mis-fotos',
  component: MisFotosComponent,
  canActivate: [AuthGuard],
  data: { expectedRole: 'participante' }
},
{
  path: 'editar-perfil',
  component: EditarUsuarioComponent,
  canActivate: [AuthGuard],
  data: { expectedRole: 'participante' }
}
];
