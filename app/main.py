from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import usuario, nino, encargado, permiso, auth

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:5173",  # URL del frontend (Vite)
    "http://localhost:3000",  # Alternativa
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(auth.router, tags=["auth"])
app.include_router(usuario.router)
app.include_router(nino.router)
app.include_router(encargado.router)
app.include_router(permiso.router)

@app.get("/")
def root():
    return {"mensaje": "¡API Vereasy!"}
