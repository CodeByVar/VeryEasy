from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.conexion import SessionLocal
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCrear, UsuarioLogin, UsuarioMostrar
from app.core.segurity import hash_password, verify_password, create_token
from app.core.dependencias import solo_admin

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login")

# Obtener instancia de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔐 Ruta protegida solo para admin
@router.get("/admin-only")
def acceso_admin(usuario=Depends(solo_admin)):
    return {"mensaje": f"Bienvenido, administrador {usuario['correo']}"}

# 🧾 Registro de usuario
@router.post("/registro", response_model=UsuarioMostrar)
def registrar_usuario(usuario: UsuarioCrear, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if existe:
        raise HTTPException(status_code=400, detail="Correo ya registrado")
    nuevo = Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        contrasena=hash_password(usuario.contrasena),
        rol=usuario.rol
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# 🔐 Login de usuario
@router.post("/login")
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if not usuario or not verify_password(datos.contrasena, usuario.contrasena):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_token({"sub": usuario.correo, "rol": usuario.rol})
    return {"access_token": token, "token_type": "bearer"}
