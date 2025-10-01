from sqlalchemy import create_engine, text
from app.database.conexion import DATABASE_URL
from app.models.nino import Nino
from app.database.conexion import Base

def migrate_ninos_table():
    """
    Script para migrar la tabla de niños a la nueva estructura
    """
    engine = create_engine(DATABASE_URL)
    
    try:
        # Crear la nueva tabla con la estructura actualizada
        Base.metadata.create_all(bind=engine, tables=[Nino.__table__])
        
        print("✅ Migración de tabla de niños completada exitosamente")
        print("📋 Nueva estructura de la tabla:")
        
        # Mostrar la estructura de la tabla
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'ninos' 
                ORDER BY ordinal_position
            """))
            
            for row in result:
                nullable = "NULL" if row.is_nullable == "YES" else "NOT NULL"
                default = f"DEFAULT {row.column_default}" if row.column_default else ""
                print(f"   - {row.column_name}: {row.data_type} {nullable} {default}")
                
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    print("🚀 Iniciando migración de tabla de niños...")
    migrate_ninos_table()
