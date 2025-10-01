from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

class PermisoBase(BaseModel):
    id_nino: int
    id_encargado: int
    tipo_permiso: str
    destino: str
    motivo: str
    fecha_salida: date
    hora_salida: str
    fecha_retorno: date
    hora_retorno: str
    transporte: Optional[str] = None
    acompanante: Optional[str] = None
    telefono_contacto: Optional[str] = None
    documentos_adjuntos: Optional[str] = None

class PermisoCrear(PermisoBase):
    pass

class PermisoActualizar(BaseModel):
    tipo_permiso: Optional[str] = None
    destino: Optional[str] = None
    motivo: Optional[str] = None
    fecha_salida: Optional[date] = None
    hora_salida: Optional[str] = None
    fecha_retorno: Optional[date] = None
    hora_retorno: Optional[str] = None
    estado: Optional[str] = None
    observaciones_aprobacion: Optional[str] = None
    transporte: Optional[str] = None
    acompanante: Optional[str] = None
    telefono_contacto: Optional[str] = None
    documentos_adjuntos: Optional[str] = None

class PermisoAprobacion(BaseModel):
    estado: str  # Aprobado, Rechazado
    observaciones_aprobacion: Optional[str] = None
    aprobado_por: str

class PermisoMostrar(PermisoBase):
    id: int
    estado: str
    fecha_aprobacion: Optional[datetime] = None
    aprobado_por: Optional[str] = None
    observaciones_aprobacion: Optional[str] = None
    fecha_solicitud: datetime
    fecha_actualizacion: Optional[datetime] = None
    fecha_expiracion: Optional[datetime] = None

    class Config:
        from_attributes = True

class PermisoDetallado(PermisoMostrar):
    # Información del niño
    nino_nombre: Optional[str] = None
    nino_apellido: Optional[str] = None
    nino_ci: Optional[str] = None
    
    # Información del encargado
    encargado_nombre: Optional[str] = None
    encargado_apellido: Optional[str] = None
    encargado_telefono: Optional[str] = None

    class Config:
        from_attributes = True
