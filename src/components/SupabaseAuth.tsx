import { useState } from 'react';
import { motion } from 'framer-motion';
import * as supabaseClient from '../lib/supabase';
import { toast } from 'sonner';

export function SupabaseAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabaseClient.signIn(email, password);
        
        if (error) throw error;
        
        toast.success('Login realizado com sucesso!');
      } else {
        // Registro
        const { data, error } = await supabaseClient.signUp(email, password, {
          full_name: fullName
        });
        
        if (error) throw error;
        
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar o registro.');
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      toast.error(error.message || 'Erro ao processar a solicitação');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-rose-100">
      <motion.h2 
        className="text-2xl font-serif text-rose-600 mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
      </motion.h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={!isLogin}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-rose-400 focus:ring focus:ring-rose-200 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="Seu nome completo"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-rose-400 focus:ring focus:ring-rose-200 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-rose-400 focus:ring focus:ring-rose-200 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="••••••••"
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {isLogin ? 'Entrar' : 'Criar conta'}
        </motion.button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-rose-600 hover:text-rose-700 text-sm font-medium"
        >
          {isLogin ? 'Não tem uma conta? Crie uma agora' : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  );
}
