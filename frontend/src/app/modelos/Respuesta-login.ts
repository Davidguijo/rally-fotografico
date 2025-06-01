export interface RespuestaLogin {
    success: boolean;
    token: string;
    usuario: {
      id: number;
      nombre: string;
    };
    rol: 'administrador' | 'participante';
    error?: string;
}
