from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: str = "padre"

class UsuarioCrear(UsuarioBase):
    contrasena: str

class UsuarioMostrar(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str
