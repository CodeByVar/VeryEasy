from sqlalchemy import Column, Integer, String, Date, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.conexion import Base

class Permiso(Base):
    __tablename__ = "permisos"

    id = Column(Integer, primary_key=True, index=True)
    id_nino = Column(Integer, ForeignKey("ninos.id"), nullable=False)
    id_encargado = Column(Integer, ForeignKey("encargados.id"), nullable=False)
    
    # Información del permiso
    tipo_permiso = Column(String(50), nullable=False)  # Salida médica, Familiar, Deportivo, etc.
    destino = Column(String(255), nullable=False)
    motivo = Column(Text, nullable=False)
    fecha_salida = Column(Date, nullable=False)
    hora_salida = Column(String(10), nullable=False)  # HH:MM
    fecha_retorno = Column(Date, nullable=False)
    hora_retorno = Column(String(10), nullable=False)  # HH:MM
    
    # Estado y aprobación
    estado = Column(String(20), default="Pendiente")  # Pendiente, Aprobado, Rechazado, Expirado
    fecha_aprobacion = Column(DateTime(timezone=True), nullable=True)
    aprobado_por = Column(String(255), nullable=True)  # Nombre del administrador que aprobó
    observaciones_aprobacion = Column(Text, nullable=True)
    
    # Información adicional
    transporte = Column(String(100), nullable=True)  # A pie, Vehículo propio, Transporte público, etc.
    acompanante = Column(String(255), nullable=True)  # Nombre del acompañante
    telefono_contacto = Column(String(20), nullable=True)  # Teléfono de contacto durante la salida
    documentos_adjuntos = Column(Text, nullable=True)  # JSON con lista de documentos
    
    # Fechas de control
    fecha_solicitud = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    fecha_expiracion = Column(DateTime(timezone=True), nullable=True)
    
    # Relaciones
    nino = relationship("Nino", back_populates="permisos")
    encargado = relationship("Encargado", back_populates="permisos")
