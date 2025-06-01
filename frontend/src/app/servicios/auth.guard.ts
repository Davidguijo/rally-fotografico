import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //Si el usuario no esta autenticado se redirige al login
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return false;
    }

    //Obtenemos el rol requerido de la ruta
    const expectedRole = route.data['expectedRole'];
    //Obtiene el rol del usuario desde localStorage
    const userRole = localStorage.getItem('rol');

    //Si la ruta requiere un rol especifico y el usuario no lo tiene se redirige al home
    if (expectedRole && userRole !== expectedRole) {
      alert(`Error: Se requiere rol de ${expectedRole}`);
      this.router.navigate(['/']);
      return false;
    }

    //Si esta autenticado y tiene el rol correcto se le permite el acceso
    return true;
  }
}