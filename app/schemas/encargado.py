from pydantic import BaseModel, EmailStr

class EncargadoBase(BaseModel):
    nombre: str
    apellido: str
    ci: str
    telefono: str
    direccion: str | None = None     # 👈 nuevo
    correo: EmailStr | None = None   # 👈 nuevo (valida que sea un correo)

class EncargadoCrear(EncargadoBase):
    pass

class EncargadoMostrar(EncargadoBase):
    id: int

    class Config:
        from_attributes = True
