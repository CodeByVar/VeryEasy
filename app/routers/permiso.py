from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.conexion import SessionLocal
from app.models.permiso import Permiso
from app.schemas.permiso import PermisoCrear, PermisoMostrar

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

@router.post("/", response_model=PermisoMostrar)
def crear_permiso(permiso: PermisoCrear, db: Session = Depends(get_db)):
    nuevo = Permiso(**permiso.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[PermisoMostrar])
def obtener_permisos(db: Session = Depends(get_db)):
    return db.query(Permiso).all()

@router.get("/{permiso_id}", response_model=PermisoMostrar)
def obtener_permiso(permiso_id: int, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    return permiso

@router.put("/{permiso_id}", response_model=PermisoMostrar)
def actualizar_permiso(permiso_id: int, datos: PermisoCrear, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    for campo, valor in datos.dict().items():
        setattr(permiso, campo, valor)
    db.commit()
    db.refresh(permiso)
    return permiso

@router.delete("/{permiso_id}")
def eliminar_permiso(permiso_id: int, db: Session = Depends(get_db)):
    permiso = db.query(Permiso).filter(Permiso.id == permiso_id).first()
    if not permiso:
        raise HTTPException(status_code=404, detail="Permiso no encontrado")
    db.delete(permiso)
    db.commit()
    return {"mensaje": "Permiso eliminado"}
