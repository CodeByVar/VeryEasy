from pydantic import BaseModel
from datetime import date

class PermisoBase(BaseModel):
    id_nino: int
    id_encargado: int
    destino: str
    fecha_salida: date
    fecha_retorno: date
    estado: str = "pendiente"

class PermisoCrear(PermisoBase):
    pass

class PermisoMostrar(PermisoBase):
    id: int

    class Config:
        from_attributes = True
