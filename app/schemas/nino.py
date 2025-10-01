from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class NinoBase(BaseModel):
    nombre: str
    fecha_nacimiento: date
    genero: str
    carnet: str
    tipo_sangre: str
    departamento: str
    ciudad: str
    direccion: str
    telefono: Optional[str] = None
    email: Optional[str] = None
    encargado: str
    telefono_encargado: str
    colegio: str
    grado: str
    alergias: Optional[str] = "Ninguna"
    medicamentos: Optional[str] = "Ninguno"
    condiciones_medicas: Optional[str] = None
    nombre_padre: Optional[str] = None
    nombre_madre: Optional[str] = None
    observaciones: Optional[str] = None
    estado: str = "Activo"
    permisos_activos: int = 0
    viajes_realizados: int = 0

class NinoCrear(NinoBase):
    pass

class NinoActualizar(BaseModel):
    nombre: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    genero: Optional[str] = None
    carnet: Optional[str] = None
    tipo_sangre: Optional[str] = None
    departamento: Optional[str] = None
    ciudad: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    encargado: Optional[str] = None
    telefono_encargado: Optional[str] = None
    colegio: Optional[str] = None
    grado: Optional[str] = None
    alergias: Optional[str] = None
    medicamentos: Optional[str] = None
    condiciones_medicas: Optional[str] = None
    nombre_padre: Optional[str] = None
    nombre_madre: Optional[str] = None
    observaciones: Optional[str] = None
    estado: Optional[str] = None
    permisos_activos: Optional[int] = None
    viajes_realizados: Optional[int] = None

class NinoMostrar(NinoBase):
    id: int

    class Config:
        from_attributes = True
