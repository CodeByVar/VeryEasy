from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.conexion import SessionLocal
from app.models.encargado import Encargado
from app.schemas.encargado import EncargadoCrear, EncargadoMostrar

router = APIRouter(
    prefix="/encargados",
    tags=["encargados"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear encargado
@router.post("/", response_model=EncargadoMostrar)
def crear_encargado(encargado: EncargadoCrear, db: Session = Depends(get_db)):
    existente = db.query(Encargado).filter(Encargado.ci == encargado.ci).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un encargado con ese CI")
    nuevo = Encargado(**encargado.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# Obtener todos
@router.get("/", response_model=list[EncargadoMostrar])
def obtener_encargados(db: Session = Depends(get_db)):
    return db.query(Encargado).all()

# Obtener por ID
@router.get("/{encargado_id}", response_model=EncargadoMostrar)
def obtener_encargado(encargado_id: int, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.id == encargado_id).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    return encargado

# Actualizar
@router.put("/{encargado_id}", response_model=EncargadoMostrar)
def actualizar_encargado(encargado_id: int, datos: EncargadoCrear, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.id == encargado_id).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    for campo, valor in datos.dict().items():
        setattr(encargado, campo, valor)
    db.commit()
    db.refresh(encargado)
    return encargado

# Eliminar
@router.delete("/{encargado_id}")
def eliminar_encargado(encargado_id: int, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.id == encargado_id).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    db.delete(encargado)
    db.commit()
    return {"mensaje": "Encargado eliminado"}
