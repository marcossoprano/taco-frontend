import React, { useState, useEffect } from 'react';
import './global.css';
import axios from 'axios';

function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);

  const buscarAlimento = async () => {
    if (!busca.trim() || !quantidade.trim()) {
      setError('Informe nome e quantidade!');
      return;
    }
    setLoading(true);
    setError(null);
    setShowSugestoes(false);
    try {
      const response = await axios.get(`http://localhost:8000/api/alimentos/consulta/?nome=${encodeURIComponent(busca)}&quantidade=${encodeURIComponent(quantidade)}`);
      setAlimentos([response.data]);
    } catch (err) {
      setError('Alimento não encontrado ou erro na consulta');
      setAlimentos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSugestoes = async () => {
      if (busca.trim().length < 2) {
        setSugestoes([]);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/api/alimentos/sugestoes/?q=${encodeURIComponent(busca)}`);
        setSugestoes(response.data.sugestoes || []);
        setShowSugestoes(true);
      } catch {
        setSugestoes([]);
      }
    };
    fetchSugestoes();
  }, [busca]);

  return (
    <>
      {/* Capa temática de alimentos */}
      <div className="banner" style={{flexDirection: 'column', padding: '2rem 0', background: 'var(--color-primary)', backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#fff', textShadow: '2px 2px 8px #145A32'}}>TACO - Consulta de Alimentos</span>
        <span style={{marginTop: '1rem', fontSize: '1.1rem', color: '#fff', background: 'rgba(20,90,50,0.7)', borderRadius: '8px', padding: '0.5rem 1rem', maxWidth: '600px'}}>Este sistema permite consultar informações nutricionais de alimentos e calcular os nutrientes da sua dieta. Basta digitar o nome do alimento, informar a quantidade em gramas e clicar em buscar. Ideal para quem deseja controlar a alimentação!</span>
      </div>
      {/* Centralização da consulta */}
      <div className="consulta-centralizada">
        <div style={{display: 'flex', gap: '1rem', position: 'relative', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
            <input 
              type="text" 
              value={busca} 
              onChange={e => setBusca(e.target.value)} 
              onFocus={() => setShowSugestoes(true)}
              onBlur={() => setTimeout(() => setShowSugestoes(false), 200)}
              placeholder="Nome do alimento..." 
              style={{padding: '0.8rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', width: '220px'}}
            />
            {showSugestoes && sugestoes.length > 0 && (
              <ul style={{position: 'absolute', top: '48px', left: 0, background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px', width: '220px', zIndex: 10, maxHeight: '180px', overflowY: 'auto', margin: 0, padding: '0.3rem 0'}}>
                {sugestoes.map((s, idx) => (
                  <li key={idx} style={{padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem'}} onMouseDown={() => { setBusca(s); setShowSugestoes(false); }}>
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
            style={{padding: '0.8rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', width: '160px'}}
          />
          <button onClick={buscarAlimento} style={{padding: '0.8rem 2rem', fontSize: '1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>Buscar alimento</button>
        </div>
      </div>
      {/* Lista de alimentos */}
      <div className="food-list">
        {loading && <span>Carregando...</span>}
        {error && <span style={{color: 'red'}}>{error}</span>}
        {alimentos.length > 0 && alimentos.map((alimento, idx) => (
          <div className="card card-green" key={idx}>
            <h3>{alimento.nome}</h3>
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
