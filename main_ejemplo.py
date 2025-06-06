from fastapi import FastAPI
from app.routers import usuario, nino, encargado, permiso  

app = FastAPI()

app.include_router(usuario.router)
app.include_router(nino.router)  
app.include_router(encargado.router)  
app.include_router(permiso.router)  

@app.get("/")
def root():
    return {"mensaje": "¡API Vereasy!"}
