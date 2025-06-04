
import './App.css';
import Sliderbar from './components/Sliderbar.jsx';




function App() {
  return (
<div className="App" style={{ display: 'flex' }}>
      <Sliderbar />
      <div style={{ marginLeft: '220px', padding: '20px' }}>
        <h1>Bienvenido al sistema de verificación de niños</h1>
        <p>Selecciona una opción del menú.</p>
        
      </div>
    </div>
  );
}

export default App;
