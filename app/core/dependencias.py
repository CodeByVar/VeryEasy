from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from app.database.conexion import SessionLocal
from app.models.usuario import Usuario
from app.core.segurity import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login")

def obtener_usuario_actual(token: str = Depends(oauth2_scheme)):
    credenciales_excepcion = HTTPException(
        status_code=401,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        correo: str = payload.get("sub")
        rol: str = payload.get("rol")
        if correo is None or rol is None:
            raise credenciales_excepcion
        return {"correo": correo, "rol": rol}
    except JWTError:
        raise credenciales_excepcion

def solo_admin(usuario=Depends(obtener_usuario_actual)):
    if usuario["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Acceso solo para administradores")
    return usuario

def solo_encargado(usuario=Depends(obtener_usuario_actual)):
    if usuario["rol"] != "encargado":
        raise HTTPException(status_code=403, detail="Acceso solo para encargados")
    return usuario
