import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// Cole sua URL e Chave Anon aqui diretamente para testar rápido:
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'SUA_URL_SUPABASE';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function App() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Erro ao entrar: Verifique e-mail e senha.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Se o usuário estiver logado, mostra o Painel Principal
  if (session) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">SV Autos Locações - Painel</h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 transition"
            >
              Sair
            </button>
          </div>
          <div className="mt-6">
            <p className="text-gray-600">Bem-vindo! Você está conectado com sucesso ao Supabase.</p>
            <div className="mt-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">Usuário logado:</p>
              <p className="text-sm text-blue-600">{session.user.email}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostra a Tela de Login
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">SV Autos Locações</h1>
          <p className="mt-1 text-sm text-gray-500">Entre com suas credenciais do sistema</p>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="seuemail@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
