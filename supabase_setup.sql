-- Configuração inicial do banco de dados Supabase para o projeto Paraamin
-- Este script cria as tabelas necessárias conforme especificado na documentação

-- Habilitar a extensão UUID para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  birthday DATE,
  relationship_date DATE,
  bio TEXT
);

-- Função para atualizar o timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp 'updated_at' em profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_special BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  category TEXT CHECK (category IN ('love', 'memory', 'future_plans'))
);

-- Tabela de marcos do relacionamento
CREATE TABLE IF NOT EXISTS relationship_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  image_url TEXT,
  importance INTEGER CHECK (importance BETWEEN 1 AND 5)
);

-- Tabela de datas especiais
CREATE TABLE IF NOT EXISTS special_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  recurrence TEXT CHECK (recurrence IN ('yearly', 'monthly', 'once')),
  reminder_days INTEGER DEFAULT 7,
  description TEXT
);

-- Tabela de lista de desejos
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  link TEXT,
  priority INTEGER CHECK (priority BETWEEN 1 AND 3),
  fulfilled BOOLEAN DEFAULT FALSE
);

-- Políticas de segurança de linha (RLS)
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Política para profiles (qualquer usuário autenticado pode ver todos os perfis, mas só pode editar o próprio)
CREATE POLICY "Permitir leitura de todos os perfis" ON profiles FOR SELECT USING (true);
CREATE POLICY "Permitir edição apenas do próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Política para messages (usuários podem ver todas as mensagens, mas só podem criar/editar suas próprias)
CREATE POLICY "Permitir leitura de todas as mensagens" ON messages FOR SELECT USING (true);
CREATE POLICY "Permitir inserção apenas nas próprias mensagens" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Permitir atualização apenas nas próprias mensagens" ON messages FOR UPDATE USING (auth.uid() = user_id);

-- Política para relationship_milestones (qualquer usuário autenticado pode ver/editar)
CREATE POLICY "Permitir acesso total a marcos de relacionamento" ON relationship_milestones FOR ALL USING (true);

-- Política para special_dates (qualquer usuário autenticado pode ver/editar)
CREATE POLICY "Permitir acesso total a datas especiais" ON special_dates FOR ALL USING (true);

-- Política para wishlist (usuários podem ver todos os itens, mas só podem criar/editar seus próprios)
CREATE POLICY "Permitir leitura de todos os itens da lista de desejos" ON wishlist FOR SELECT USING (true);
CREATE POLICY "Permitir inserção apenas nos próprios itens da lista" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Permitir atualização apenas nos próprios itens da lista" ON wishlist FOR UPDATE USING (auth.uid() = user_id);

-- Criação de gatilho para criar automaticamente um perfil quando um novo usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir dados iniciais para teste
INSERT INTO relationship_milestones (title, description, date, importance)
VALUES 
  ('Primeiro Encontro', 'Nosso primeiro encontro no parque', '2023-06-15', 5),
  ('Primeiro Beijo', 'Nosso primeiro beijo sob as estrelas', '2023-06-30', 5),
  ('Pedido de Namoro', 'O dia em que oficializamos nosso relacionamento', '2023-07-15', 5);

INSERT INTO special_dates (title, date, recurrence, description)
VALUES 
  ('Aniversário de Namoro', '2023-07-15', 'yearly', 'Data em que começamos a namorar'),
  ('Dia dos Namorados', '2024-06-12', 'yearly', 'Celebração do nosso amor');
