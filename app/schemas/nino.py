from pydantic import BaseModel
from datetime import date

class NinoBase(BaseModel):
    nombre: str
    apellido: str
    fecha_nacimiento: date
    ci: str

class NinoCrear(NinoBase):
    pass

class NinoMostrar(NinoBase):
    id: int

    class Config:
        from_attributes = True
