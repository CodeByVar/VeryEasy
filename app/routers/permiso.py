from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from app.database.conexion import SessionLocal
from app.models.permiso import Permiso
from app.models.nino import Nino
from app.models.encargado import Encargado
from app.schemas.permiso import (
    PermisoCrear, PermisoMostrar, PermisoActualizar, 
    PermisoAprobacion, PermisoDetallado
)
from typing import List, Optional
from datetime import datetime, date

router = APIRouter(
    prefix="/permisos",
    tags=["permisos"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear permiso
@router.post("/", response_model=PermisoMostrar)
def crear_permiso(permiso: PermisoCrear, db: Session = Depends(get_db)):
    # Verificar que el niño y encargado existan
    nino = db.query(Nino).filter(Nino.id == permiso.id_nino).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    encargado = db.query(Encargado).filter(Encargado.id == permiso.id_encargado).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    
    # Crear nuevo permiso
    nuevo_permiso = Permiso(**permiso.dict())
    db.add(nuevo_permiso)
    db.commit()
    db.refresh(nuevo_permiso)
    return nuevo_permiso

# Obtener todos los permisos con filtros opcionales
@router.get("/", response_model=List[PermisoDetallado])
def obtener_permisos(
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    tipo_permiso: Optional[str] = Query(None, description="Filtrar por tipo de permiso"),
    id_nino: Optional[int] = Query(None, description="Filtrar por niño"),
    id_encargado: Optional[int] = Query(None, description="Filtrar por encargado"),
    fecha_desde: Optional[date] = Query(None, description="Filtrar desde fecha"),
    fecha_hasta: Optional[date] = Query(None, description="Filtrar hasta fecha"),
    db: Session = Depends(get_db)
):
    query = db.query(Permiso).join(Nino).join(Encargado)
    
    # Aplicar filtros si se proporcionan
    if estado:
        query = query.filter(Permiso.estado == estado)
    if tipo_permiso:
        query = query.filter(Permiso.tipo_permiso == tipo_permiso)
    if id_nino:
        query = query.filter(Permiso.id_nino == id_nino)
    if id_encargado:
        query = query.filter(Permiso.id_encargado == id_encargado)
    if fecha_desde:
        query = query.filter(Permiso.fecha_salida >= fecha_desde)
    if fecha_hasta:
        query = query.filter(Permiso.fecha_salida <= fecha_hasta)
    
    # Aplicar paginación
    permisos = query.offset(skip).limit(limit).all()
    
    # Convertir a PermisoDetallado
    result = []
    for permiso in permisos:
        detallado = PermisoDetallado(
            **permiso.__dict__,
            nino_nombre=permiso.nino.nombre if permiso.nino else None,
            nino_apellido=permiso.nino.apellido if permiso.nino else None,
            nino_ci=permiso.nino.carnet if permiso.nino else None,
            encargado_nombre=permiso.encargado.nombre if permiso.encargado else None,
            encargado_apellido=permiso.encargado.apellido if permiso.encargado else None,
            encargado_telefono=permiso.encargado.telefono if permiso.encargado else None
        )
        result.append(detallado)
    
    return result

# Obtener permiso por ID
@router.get("/{permiso_id}", response_model=PermisoDetallado)
def obtener_permiso(permiso_id: int, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).join(Nino).join(Encargado).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    
    return PermisoDetallado(
        **permiso.__dict__,
        nino_nombre=permiso.nino.nombre if permiso.nino else None,
        nino_apellido=permiso.nino.apellido if permiso.nino else None,
        nino_ci=permiso.nino.carnet if permiso.nino else None,
        encargado_nombre=permiso.encargado.nombre if permiso.encargado else None,
        encargado_apellido=permiso.encargado.apellido if permiso.encargado else None,
        encargado_telefono=permiso.encargado.telefono if permiso.encargado else None
    )

# Actualizar permiso
@router.put("/{permiso_id}", response_model=PermisoMostrar)
def actualizar_permiso(permiso_id: int, datos: PermisoActualizar, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    
    # Actualizar solo los campos proporcionados
    update_data = datos.dict(exclude_unset=True)
    for campo, valor in update_data.items():
        setattr(permiso, campo, valor)
    
    db.commit()
    db.refresh(permiso)
    return permiso

# Aprobar/Rechazar permiso
@router.put("/{permiso_id}/aprobar", response_model=PermisoMostrar)
def aprobar_permiso(permiso_id: int, aprobacion: PermisoAprobacion, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    
    if permiso.estado != "Pendiente":
        raise HTTPException(status_code=400, detail="Solo se pueden aprobar permisos pendientes")
    
    # Actualizar estado y datos de aprobación
    permiso.estado = aprobacion.estado
    permiso.fecha_aprobacion = datetime.now()
    permiso.aprobado_por = aprobacion.aprobado_por
    permiso.observaciones_aprobacion = aprobacion.observaciones_aprobacion
    
    db.commit()
    db.refresh(permiso)
    return permiso

# Eliminar permiso
@router.delete("/{permiso_id}")
def eliminar_permiso(permiso_id: int, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    
    db.delete(permiso)
    db.commit()
    return {"mensaje": "Permiso eliminado exitosamente"}

# Obtener permisos por niño
@router.get("/nino/{nino_id}", response_model=List[PermisoDetallado])
def obtener_permisos_por_nino(nino_id: int, db: Session = Depends(get_db)):
    permisos = db.query(Permiso).join(Nino).join(Encargado).filter(Permiso.id_nino == nino_id).all()
    
    result = []
    for permiso in permisos:
        detallado = PermisoDetallado(
            **permiso.__dict__,
            nino_nombre=permiso.nino.nombre if permiso.nino else None,
            nino_apellido=permiso.nino.apellido if permiso.nino else None,
            nino_ci=permiso.nino.carnet if permiso.nino else None,
            encargado_nombre=permiso.encargado.nombre if permiso.encargado else None,
            encargado_apellido=permiso.encargado.apellido if permiso.encargado else None,
            encargado_telefono=permiso.encargado.telefono if permiso.encargado else None
        )
        result.append(detallado)
    
    return result

# Obtener estadísticas de permisos
@router.get("/estadisticas/resumen")
def obtener_estadisticas(db: Session = Depends(get_db)):
    total_permisos = db.query(Permiso).count()
    permisos_pendientes = db.query(Permiso).filter(Permiso.estado == "Pendiente").count()
    permisos_aprobados = db.query(Permiso).filter(Permiso.estado == "Aprobado").count()
    permisos_rechazados = db.query(Permiso).filter(Permiso.estado == "Rechazado").count()
    
    # Estadísticas por tipo de permiso
    tipos_permiso = db.query(Permiso.tipo_permiso, db.func.count(Permiso.id)).group_by(Permiso.tipo_permiso).all()
    
    return {
        "total_permisos": total_permisos,
        "permisos_pendientes": permisos_pendientes,
        "permisos_aprobados": permisos_aprobados,
        "permisos_rechazados": permisos_rechazados,
        "por_tipo_permiso": dict(tipos_permiso)
    }
