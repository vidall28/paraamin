import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://rfoxovjukfzmffcocdyt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmb3hvdmp1a2Z6bWZmY29jZHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Njk1MDQsImV4cCI6MjA2MTM0NTUwNH0.RN-spvfBPRd2aJ9b_iz5qykRzvK6jE8QCE2ADPk7T58';

// Criando o cliente do Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Funções auxiliares para autenticação
export async function signUp(email: string, password: string, metaData = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metaData
    }
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Funções para o CRUD de mensagens
export async function getMessages(category?: string) {
  const query = supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (category) {
    query.eq('category', category);
  }
  
  const { data, error } = await query;
  return { data, error };
}

export async function addMessage(content: string, category: string, isSpecial: boolean = false) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: { message: 'Usuário não autenticado' } };
  }
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: user.id,
      content,
      category,
      is_special: isSpecial,
      read: false
    })
    .select();
    
  return { data, error };
}

// Funções para marcos de relacionamento
export async function getMilestones() {
  const { data, error } = await supabase
    .from('relationship_milestones')
    .select('*')
    .order('date', { ascending: true });
    
  return { data, error };
}

export async function addMilestone(
  title: string,
  description: string,
  date: string,
  importance: number,
  imageUrl?: string
) {
  const { data, error } = await supabase
    .from('relationship_milestones')
    .insert({
      title,
      description,
      date,
      importance,
      image_url: imageUrl
    })
    .select();
    
  return { data, error };
}

// Funções para datas especiais
export async function getSpecialDates() {
  const { data, error } = await supabase
    .from('special_dates')
    .select('*')
    .order('date', { ascending: true });
    
  return { data, error };
}

export async function addSpecialDate(
  title: string,
  date: string,
  recurrence: 'yearly' | 'monthly' | 'once',
  description?: string,
  reminderDays: number = 7
) {
  const { data, error } = await supabase
    .from('special_dates')
    .insert({
      title,
      date,
      recurrence,
      description,
      reminder_days: reminderDays
    })
    .select();
    
  return { data, error };
}

// Funções para lista de desejos
export async function getWishlistItems() {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .order('priority', { ascending: true });
    
  return { data, error };
}

export async function addWishlistItem(
  itemName: string,
  description?: string,
  link?: string,
  priority: number = 2
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: { message: 'Usuário não autenticado' } };
  }
  
  const { data, error } = await supabase
    .from('wishlist')
    .insert({
      user_id: user.id,
      item_name: itemName,
      description,
      link,
      priority,
      fulfilled: false
    })
    .select();
    
  return { data, error };
}

export async function updateWishlistItem(id: string, fulfilled: boolean) {
  const { data, error } = await supabase
    .from('wishlist')
    .update({ fulfilled })
    .eq('id', id)
    .select();
    
  return { data, error };
}

// Funções para perfil do usuário
export async function getProfile() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: { message: 'Usuário não autenticado' } };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return { data, error };
}

export async function updateProfile(
  fullName?: string,
  avatarUrl?: string,
  birthday?: string,
  relationshipDate?: string,
  bio?: string
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: { message: 'Usuário não autenticado' } };
  }
  
  const updates: any = {};
  
  if (fullName !== undefined) updates.full_name = fullName;
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
  if (birthday !== undefined) updates.birthday = birthday;
  if (relationshipDate !== undefined) updates.relationship_date = relationshipDate;
  if (bio !== undefined) updates.bio = bio;
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select();
    
  return { data, error };
}
