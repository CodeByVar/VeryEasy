from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EncargadoBase(BaseModel):
    nombre: str
    apellido: str
    ci: str
    telefono: str
    telefono_alternativo: Optional[str] = None
    direccion: str
    correo: Optional[str] = None
    parentesco: str
    ocupacion: Optional[str] = None
    lugar_trabajo: Optional[str] = None
    telefono_trabajo: Optional[str] = None
    estado: str = "Activo"
    observaciones: Optional[str] = None
    es_contacto_emergencia: bool = False

class EncargadoCrear(EncargadoBase):
    pass

class EncargadoActualizar(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    ci: Optional[str] = None
    telefono: Optional[str] = None
    telefono_alternativo: Optional[str] = None
    direccion: Optional[str] = None
    correo: Optional[str] = None
    parentesco: Optional[str] = None
    ocupacion: Optional[str] = None
    lugar_trabajo: Optional[str] = None
    telefono_trabajo: Optional[str] = None
    estado: Optional[str] = None
    observaciones: Optional[str] = None
    es_contacto_emergencia: Optional[bool] = None

class EncargadoMostrar(EncargadoBase):
    id: int
    fecha_registro: datetime
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True
