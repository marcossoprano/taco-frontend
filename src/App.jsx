import './global.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  // Buscar sugestões enquanto digita
  const buscarSugestoes = async (valor) => {
    if (!valor.trim()) {
      setSugestoes([]);
      return;
    }
    try {
  const response = await axios.get(`https://taco-backend-9.onrender.com/alimentos/sugestoes/?q=${encodeURIComponent(valor)}`);
      if (response.data && response.data.sugestoes) {
        setSugestoes(response.data.sugestoes);
      } else {
        setSugestoes([]);
      }
    } catch (err) {
      setSugestoes([]);
    }
  };

  const fetchAlimentos = async () => {
    setLoading(true);
    setError(null);
    try {
  const response = await axios.get('https://taco-backend-9.onrender.com/alimentos/');
      setAlimentos(response.data);
    } catch (err) {
      setError('Erro ao buscar alimentos');
    }
    setLoading(false);
  };

  const buscarPorNome = async () => {
    if (!busca.trim() || !quantidade.trim()) {
      setError('Informe o nome e a quantidade do alimento');
      return;
    }
    setLoading(true);
    setError(null);
    try {
  const response = await axios.get(`https://taco-backend-9.onrender.com/alimentos/?nome=${encodeURIComponent(busca)}&quantidade=${encodeURIComponent(quantidade)}`);
      setAlimentos(response.data);
    } catch (err) {
      setError('Erro ao buscar alimento');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Capa temática de alimentos brasileiros */}
      <div className="banner" style={{
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0',
        background: 'var(--color-primary)',
        backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '260px',
        boxSizing: 'border-box'
      }}>
        <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#fff', textShadow: '2px 2px 8px #145A32'}}>TACO - Consulta de Alimentos</span>
        <span style={{marginTop: '1rem', fontSize: '1.1rem', color: '#fff', background: 'rgba(20,90,50,0.7)', borderRadius: '8px', padding: '0.5rem 1rem', maxWidth: '600px'}}>Este sistema permite consultar informações nutricionais de alimentos brasileiros e calcular os nutrientes da sua dieta. Basta digitar o nome do alimento, informar a quantidade em gramas e clicar em buscar. Ideal para quem deseja controlar a alimentação!</span>
      </div>
      {/* Bloco de consulta centralizado */}
      <div style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '2rem'}}>
        <div style={{display: 'flex', gap: '1rem', position: 'relative', justifyContent: 'center', width: '100%', maxWidth: '700px'}}>
          <button onClick={fetchAlimentos} style={{padding: '0.8rem 2rem', fontSize: '1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>Consultar Todos</button>
          <div style={{position: 'relative'}}>
            <input 
              type="text" 
              value={busca} 
              onChange={e => {
                setBusca(e.target.value);
                buscarSugestoes(e.target.value);
                setShowSugestoes(true);
              }}
              onFocus={() => setShowSugestoes(true)}
              onBlur={() => setTimeout(() => setShowSugestoes(false), 300)}
              placeholder="Buscar alimento por nome..." 
              style={{padding: '0.8rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', width: '220px'}}
            />
            {showSugestoes && sugestoes.length > 0 && (
              <ul style={{position: 'absolute', top: '48px', left: 0, background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px', width: '220px', zIndex: 10, maxHeight: '180px', overflowY: 'auto', margin: 0, padding: '0.3rem 0'}}>
                {sugestoes.map((s, idx) => (
                  <li key={idx} style={{padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem'}}
                      onMouseDown={() => {
                        setBusca(s);
                        setTimeout(() => setShowSugestoes(false), 10);
                      }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input 
            type="number"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
            placeholder="Quantidade (g)"
            style={{padding: '0.8rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', width: '120px'}}
          />
          <button onClick={buscarPorNome} style={{padding: '0.8rem 2rem', fontSize: '1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>Buscar</button>
        </div>
      </div>
      {/* Card centralizado com informações nutricionais */}
  <div style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '2rem'}}>
        {loading && <span>Carregando...</span>}
        {error && <span style={{color: 'red'}}>{error}</span>}
        {alimentos && !Array.isArray(alimentos) && alimentos.nome && (
          <div className="card" style={{margin: '2rem auto', maxWidth: '350px', background: 'var(--color-primary)', color: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center'}}>
            <h3 style={{fontSize: '1.6rem', marginBottom: '1rem'}}>{alimentos.nome}</h3>
            <p>Quantidade: {alimentos.quantidade}g</p>
            <p>Calorias: {alimentos.calorias}</p>
            <p>Proteínas: {alimentos.proteinas}g</p>
            <p>Carboidratos: {alimentos.carboidratos}g</p>
            <p>Gorduras: {alimentos.gorduras}g</p>
          </div>
        )}
        {Array.isArray(alimentos) && alimentos.length > 0 && alimentos.map((alimento, idx) => (
          <div className="card" key={idx} style={{margin: '2rem auto', maxWidth: '350px', background: 'var(--color-primary)', color: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center'}}>
            <h3 style={{fontSize: '1.6rem', marginBottom: '1rem'}}>{alimento.nome}</h3>
            <p>Quantidade: {alimento.quantidade}g</p>
            <p>Calorias: {alimento.calorias}</p>
            <p>Proteínas: {alimento.proteinas}g</p>
            <p>Carboidratos: {alimento.carboidratos}g</p>
            <p>Gorduras: {alimento.gorduras}g</p>
          </div>
        ))}
      </div>
      {/* Rodapé com referência ao criador e contato */}
      <footer style={{width: '100%', textAlign: 'center', marginTop: '2rem', padding: '1rem 0', background: 'rgba(20,90,50,0.1)', color: '#145A32', fontSize: '1rem'}}>
        Sistema desenvolvido por Marcos Ryan | Contato: <a href="mailto:marcosryan140@gmail.com" style={{color: '#145A32', textDecoration: 'underline'}}>marcosryan140@gmail.com</a>
      </footer>
    </>
  );
}

export default App;
