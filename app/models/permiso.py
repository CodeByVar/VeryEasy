from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.conexion import Base

class Permiso(Base):
    __tablename__ = "permisos"

    id = Column(Integer, primary_key=True, index=True)
    id_nino = Column(Integer, ForeignKey("ninos.id"), nullable=False)
    id_encargado = Column(Integer, ForeignKey("encargados.id"), nullable=False)
    destino = Column(String, nullable=False)
    fecha_salida = Column(Date, nullable=False)
    fecha_retorno = Column(Date, nullable=False)
    estado = Column(String, default="pendiente")

    nino = relationship("Nino")
    encargado = relationship("Encargado")
