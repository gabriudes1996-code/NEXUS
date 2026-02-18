
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine } from 'recharts';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { mockLicitacoes, mockEventosCalendario } from './mockData';
import { Licitacao, EventoCalendario, StatusLicitacao, ContratoAssessoria, MetodoPagamento, ModeloContrato, DocumentoPDF } from './types';
import { supabase } from './services/supabase';

const COLORS = ['#C5A059', '#0A2342']; // Emerald para Ganho, Slate para Restante

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('monitor');
  const [adminSubTab, setAdminSubTab] = useState<'licitacoes' | 'financeiro'>('licitacoes');
  const [selectedCompany, setSelectedCompany] = useState('TODAS');

  // Persistence Check on Mount
  useEffect(() => {
    const storedLogin = localStorage.getItem('nexus_auth');
    if (storedLogin) {
      const authData = JSON.parse(storedLogin);
      if (!authData.isAdmin && !authData.company) {
        // Invalid or old session for client, force logout
        localStorage.removeItem('nexus_auth');
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
      setIsAdmin(authData.isAdmin);
      setActiveTab(authData.isAdmin ? 'admin' : 'monitor');
      if (authData.company) setSelectedCompany(authData.company);
    }
  }, []);

  // States para dados
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
  const [contratos, setContratos] = useState<ContratoAssessoria[]>([]);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [targetGoal, setTargetGoal] = useState(150000); // Meta mensal padrão de 150k

  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [regionFilter, setRegionFilter] = useState('Todas');
  const [organSearch, setOrganSearch] = useState('');
  const [agendaDate, setAgendaDate] = useState(new Date().toISOString().split('T')[0]);

  const [editingLicId, setEditingLicId] = useState<string | null>(null);
  const [currentDocType, setCurrentDocType] = useState<DocumentoPDF['tipo'] | 'Comprovante' | null>(null);
  const [attachingToId, setAttachingToId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editStatus, setEditStatus] = useState<StatusLicitacao>('Pendente');
  const [editMotivo, setEditMotivo] = useState('');
  const [editValorGanho, setEditValorGanho] = useState('');
  const [editDataAdiada, setEditDataAdiada] = useState('');
  const [editHoraAdiada, setEditHoraAdiada] = useState('09:00');

  const [newContrato, setNewContrato] = useState({
    empresa: 'Azul Tec', valor: '', modelo: 'Mensalidade' as ModeloContrato, metodo: 'Pix' as MetodoPagamento, vencimento: '', hasFile: false
  });

  const [newLic, setNewLic] = useState({
    numero: '', orgao: '', cidade: '', estado: '', valor: '', data: new Date().toISOString().split('T')[0], hora: '09:00', portal: 'ComprasNet', resultado: 'Pendente' as StatusLicitacao, empresa: 'Azul Papel', categoria: 'Hardware' as any
  });

  // Fetch data from Supabase on mount
  useEffect(() => {
    fetchData();
  }, [isLoggedIn]); // Refresh when login changes to ensure data is fresh

  const fetchData = async () => {
    try {
      // Fetch Licitacoes
      const { data: licData, error: licError } = await supabase.from('licitacoes').select('*').order('data', { ascending: false });
      if (licError) {
        console.error('Error fetching licitacoes:', licError);
      } else if (licData) {
        setLicitacoes(licData.map((l: any) => ({
          ...l,
          valorGanho: l.valor_ganho,
          motivoDesclassificacao: l.motivo_desclassificacao,
          // Fetch linked documents and progress if needed, for now simplified
          documentos: [], // Need to fetch these separately or join
          progresso: []
        })));

        // Fetch documents for all licitacoes (optimization: could be join)
        const { data: docData } = await supabase.from('documentos').select('*');
        if (docData && licData) {
          setLicitacoes(prev => prev.map(l => ({
            ...l,
            documentos: docData.filter((d: any) => d.licitacao_id === l.id)
          })));
        }
      }

      // Fetch Contratos
      const { data: contData, error: contError } = await supabase.from('contratos').select('*').order('created_at', { ascending: false });
      if (contError) console.error('Error fetching contratos:', contError);
      else if (contData) {
        setContratos(contData.map((c: any) => ({
          ...c,
          dataAssinatura: c.data_assinatura,
          proximoVencimento: c.proximo_vencimento,
          comprovanteUrl: c.comprovante_url
        })));
      }

      // Fetch Eventos
      const { data: evData, error: evError } = await supabase.from('eventos').select('*').order('data', { ascending: true });
      if (evError) console.error('Error fetching eventos:', evError);
      else if (evData) {
        setEventos(evData);
      }

      // Fetch Config (Monthly Goal)
      const { data: configData } = await supabase.from('config').select('*').eq('key', 'monthly_goal').single();
      if (configData) {
        setTargetGoal(parseFloat(configData.value) || 150000);
      }

    } catch (err) {
      console.error('Unexpected error fetching data:', err);
    }
  };

  const handleLoginSuccess = (admin: boolean, company?: string) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setActiveTab(admin ? 'admin' : 'monitor');
    if (company) setSelectedCompany(company);
    localStorage.setItem('nexus_auth', JSON.stringify({ isLoggedIn: true, isAdmin: admin, company }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setActiveTab('monitor');
    localStorage.removeItem('nexus_auth');
    // Optional: window.location.reload() to clear all state state cleanliness
  };

  const handleAddLicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const valorNum = newLic.valor ? parseFloat(newLic.valor.replace(',', '.')) : undefined;

    const { data: insertedLic, error } = await supabase.from('licitacoes').insert({
      numero: newLic.numero,
      orgao: newLic.orgao,
      cidade: newLic.cidade,
      estado: newLic.estado,
      valor: valorNum,
      data: newLic.data,
      hora: newLic.hora,
      portal: newLic.portal,
      resultado: newLic.resultado,
      empresa: newLic.empresa,
      categoria: 'Hardware' // Default or from state if added to form
    }).select().single();

    if (error) {
      alert('Erro ao salvar licitação: ' + error.message);
      setIsSaving(false);
      return;
    }

    const novoEvento = {
      data: newLic.data,
      hora: newLic.hora,
      objeto: `DISPUTA: ${newLic.numero} - ${newLic.orgao}`,
      portal: newLic.portal || 'Portal de Compras',
      empresa: newLic.empresa,
      importancia: 'alta'
    };

    await supabase.from('eventos').insert(novoEvento);

    await fetchData(); // Refresh data

    setNewLic({
      numero: '', orgao: '', cidade: '', estado: '', valor: '',
      data: new Date().toISOString().split('T')[0], hora: '09:00',
      portal: 'ComprasNet', resultado: 'Pendente', empresa: 'Azul Papel',
      categoria: 'Hardware'
    });
    setIsSaving(false);
    alert('Processo cadastrado e agenda sincronizada!');
  };

  const handleAddContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase.from('contratos').insert({
      empresa: newContrato.empresa,
      valor: parseFloat(newContrato.valor.replace(',', '.')) || 0,
      modelo: newContrato.modelo,
      metodo: newContrato.metodo,
      data_assinatura: new Date().toISOString().split('T')[0],
      proximo_vencimento: newContrato.vencimento || new Date().toISOString().split('T')[0],
      status: 'Ativo'
    });

    if (error) {
      alert('Erro ao criar contrato: ' + error.message);
    } else {
      await fetchData();
      setNewContrato({ empresa: 'Azul Tec', valor: '', modelo: 'Mensalidade', metodo: 'Pix', vencimento: '', hasFile: false });
    }
    setIsSaving(false);
  };

  const handleSaveValues = async (id: string) => {
    setIsSaving(true);
    const estInput = document.getElementById(`est-${id}`) as HTMLInputElement;
    const ganhInput = document.getElementById(`ganh-${id}`) as HTMLInputElement;
    const valor = estInput ? parseFloat(estInput.value.replace(',', '.')) : undefined;
    const valorGanho = ganhInput ? parseFloat(ganhInput.value.replace(',', '.')) : undefined;

    const { error } = await supabase.from('licitacoes').update({ valor, valor_ganho: valorGanho }).eq('id', id);

    if (error) alert('Erro ao atualizar valores');
    else await fetchData();

    setIsSaving(false);
  };

  const handleUpdateStatus = async () => {
    if (!editingLicId) return;
    setIsSaving(true);
    const targetLic = licitacoes.find(l => l.id === editingLicId);
    if (!targetLic) return;

    const updates: any = {
      resultado: editStatus,
      motivo_desclassificacao: editStatus === 'Desclassificado' ? editMotivo : targetLic.motivoDesclassificacao,
      valor_ganho: (['Ganhou', 'Homologado'].includes(editStatus)) ? parseFloat(editValorGanho.replace(',', '.')) || targetLic.valorGanho : targetLic.valorGanho,
      data: editStatus === 'Adiada' ? editDataAdiada || targetLic.data : targetLic.data,
      hora: editStatus === 'Adiada' ? editHoraAdiada || targetLic.hora : targetLic.hora
    };

    const { error } = await supabase.from('licitacoes').update(updates).eq('id', editingLicId);

    if (error) {
      alert('Erro ao atualizar status');
    } else {
      if (editStatus === 'Adiada' && editDataAdiada) {
        await supabase.from('eventos').insert({
          data: editDataAdiada,
          hora: editHoraAdiada,
          objeto: `[ADIADA] ${targetLic.numero} - ${targetLic.orgao}`,
          portal: targetLic.portal || 'Não Informado',
          empresa: targetLic.empresa,
          importancia: 'alta'
        });
      }
      await fetchData();
      setEditingLicId(null);
    }
    setIsSaving(false);
  };

  const triggerFilePicker = (type: DocumentoPDF['tipo'] | 'Comprovante', id: string) => {
    setCurrentDocType(type);
    setAttachingToId(id);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && attachingToId && currentDocType) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documentos')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documentos')
          .getPublicUrl(filePath);

        if (currentDocType === 'Comprovante') {
          const { error } = await supabase.from('contratos').update({ comprovante_url: publicUrl }).eq('id', attachingToId);

          if (error) throw error;

          setContratos(contratos.map(c => c.id === attachingToId ? { ...c, comprovanteUrl: publicUrl } : c));
          alert('Comprovante anexado com sucesso!');
        } else {
          // Documentos de Licitação
          const newDoc = {
            licitacao_id: attachingToId,
            nome: file.name,
            tipo: currentDocType,
            url: publicUrl
          };

          const { data, error } = await supabase.from('documentos').insert(newDoc).select().single();

          if (error) throw error;

          setLicitacoes(licitacoes.map(l => {
            if (l.id === attachingToId) {
              const doc: DocumentoPDF = { id: data.id, nome: data.nome, tipo: data.tipo as any, url: publicUrl };
              return { ...l, documentos: [...(l.documentos || []), doc] };
            }
            return l;
          }));
          alert('Documento anexado e salvo na nuvem!');
        }
      } catch (error: any) {
        alert('Erro ao fazer upload: ' + error.message);
      } finally {
        e.target.value = '';
      }
    }
  };

  const hojeStr = new Date().toISOString().split('T')[0];

  const companyLicitacoes = useMemo(() => licitacoes.filter(item => selectedCompany === 'TODAS' || item.empresa === selectedCompany), [licitacoes, selectedCompany]);

  const stats = useMemo(() => {
    const total = companyLicitacoes.length;
    const licsHoje = companyLicitacoes.filter(l => l.data === hojeStr).length;
    const desclassificadas = companyLicitacoes.filter(l => l.resultado === 'Desclassificado').length;

    // Volume total (histórico)
    const volumeTotal = companyLicitacoes.reduce((acc, curr) => acc + (curr.valorGanho || 0), 0);

    // Volume do mês atual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const volumeMensal = companyLicitacoes
      .filter(l => {
        const d = new Date(l.data);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && ['Ganhou', 'Homologado'].includes(l.resultado);
      })
      .reduce((acc, curr) => acc + (curr.valorGanho || 0), 0);

    const percentualMeta = (volumeMensal / targetGoal) * 100;
    const percDesclassificadas = total > 0 ? (desclassificadas / total) * 100 : 0;

    return { total, licsHoje, volume: volumeMensal, volumeTotal, percentualMeta, percDesclassificadas };
  }, [companyLicitacoes, targetGoal, hojeStr]);

  const goalData = useMemo(() => [
    { name: 'Arrematado', value: stats.volume },
    { name: 'Restante', value: Math.max(0, targetGoal - stats.volume) }
  ], [stats.volume, targetGoal]);

  const historyFilteredLicitacoes = useMemo(() => companyLicitacoes.filter(item => {
    const matchStatus = statusFilter === 'Todas' || item.resultado === statusFilter;
    const matchRegion = regionFilter === 'Todas' || item.estado === regionFilter;
    const matchOrgan = item.orgao.toLowerCase().includes(organSearch.toLowerCase()) || item.numero.toLowerCase().includes(organSearch.toLowerCase());
    return matchStatus && matchRegion && matchOrgan;
  }), [companyLicitacoes, statusFilter, regionFilter, organSearch]);

  const dailyAgendaEvents = useMemo(() =>
    licitacoes.filter(l =>
      l.data === agendaDate &&
      (selectedCompany === 'TODAS' || l.empresa === selectedCompany)
    ).map(l => ({
      id: l.id,
      data: l.data,
      hora: l.hora || '09:00',
      objeto: `DISPUTA: ${l.numero} - ${l.orgao}`,
      portal: l.portal || 'N/I',
      empresa: l.empresa,
      importancia: 'alta' as const
    })),
    [licitacoes, agendaDate, selectedCompany]
  );

  const monthlySalesData = useMemo(() => {
    const year = new Date().getFullYear();
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Filtra especificamente para Azul Papel e status de ganho
    const azulPapelWins = licitacoes.filter(l =>
      l.empresa === 'Azul Papel' &&
      ['Ganhou', 'Homologado'].includes(l.resultado) &&
      new Date(l.data).getFullYear() === year
    );

    const monthlyGoal = targetGoal / 12;

    return months.map((month, index) => {
      const monthTotal = azulPapelWins
        .filter(l => new Date(l.data).getMonth() === index)
        .reduce((acc, curr) => acc + (curr.valorGanho || 0), 0);

      return {
        name: month,
        total: monthTotal,
        goalMet: monthTotal >= targetGoal,
        target: targetGoal
      };
    });
  }, [licitacoes, targetGoal]);

  const handleUpdateMeta = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('config').update({ value: targetGoal.toString() }).eq('key', 'monthly_goal');
    if (error) {
      alert('Erro ao atualizar meta: ' + error.message);
    } else {
      alert('Meta mensal atualizada para todos os ambientes!');
      await fetchData();
    }
    setIsSaving(false);
  };

  const handleDeleteLicitacao = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente esta licitação?')) {
      try {
        const { error } = await supabase.from('licitacoes').delete().eq('id', id);
        if (error) throw error;
        setLicitacoes(prev => prev.filter(l => l.id !== id));
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir registro.');
      }
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'admin':
        return (
          <div className="space-y-10 animate-fade-in relative">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            <div className="flex bg-white/5 p-1.5 rounded-[1.8rem] border border-white/5 w-fit">
              <button onClick={() => setAdminSubTab('licitacoes')} className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${adminSubTab === 'licitacoes' ? 'bg-[#C5A059] text-[#0A2342] shadow-lg' : 'text-slate-500 hover:text-white'}`}>Gestão Operacional</button>
              <button onClick={() => setAdminSubTab('financeiro')} className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${adminSubTab === 'financeiro' ? 'bg-[#C5A059] text-[#0A2342] shadow-lg' : 'text-slate-500 hover:text-white'}`}>Metas & Faturamento</button>
            </div>

            {adminSubTab === 'licitacoes' ? (
              <>
                {editingLicId && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
                      <h3 className="text-white font-black text-xl uppercase mb-6">Status Nexus</h3>
                      <div className="space-y-5">
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value as StatusLicitacao)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-white text-xs font-bold outline-none">
                          <option value="Pendente">Pendente</option>
                          <option value="Ganhou">Ganhou</option>
                          <option value="Perdeu">Perdeu</option>
                          <option value="Desclassificado">Desclassificado</option>
                          <option value="Em Recurso">Em Recurso</option>
                          <option value="Recurso">Recurso</option>
                          <option value="Adiada">Adiada</option>
                          <option value="Homologado">Homologado</option>
                          <option value="Contrato Assinado">Contrato Assinado</option>
                        </select>
                        {editStatus === 'Desclassificado' && <textarea value={editMotivo} onChange={e => setEditMotivo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs min-h-[100px]" placeholder="Motivo detalhado da desclassificação..." />}
                        {editStatus === 'Adiada' && (
                          <div className="grid grid-cols-2 gap-4">
                            <input type="date" value={editDataAdiada} onChange={e => setEditDataAdiada(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-xs font-bold" />
                            <input type="time" value={editHoraAdiada} onChange={e => setEditHoraAdiada(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-xs font-bold" />
                          </div>
                        )}
                        {(['Ganhou', 'Homologado'].includes(editStatus)) && <input type="text" value={editValorGanho} onChange={e => setEditValorGanho(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-emerald-400 text-xs font-mono" placeholder="Valor Ganho Final (R$)" />}
                        <div className="flex gap-4 pt-4">
                          <button onClick={() => setEditingLicId(null)} className="flex-1 py-4 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase">Sair</button>
                          <button onClick={handleUpdateStatus} className="flex-1 py-4 bg-[#C5A059] text-[#0A2342] rounded-xl font-black uppercase text-[10px] hover:bg-[#E5C789] transition-all">Salvar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl">
                    <h3 className="text-white font-bold text-xl uppercase mb-6 flex items-center gap-3">
                      <span className="w-2 h-6 bg-[#C5A059] rounded-full"></span>
                      Gestão Operacional: Novo Registro
                    </h3>
                    <form onSubmit={handleAddLicitacao} className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <input placeholder="Órgão Licitante" value={newLic.orgao} onChange={e => setNewLic({ ...newLic, orgao: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs" required />
                        <input placeholder="Edital/Processo" value={newLic.numero} onChange={e => setNewLic({ ...newLic, numero: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs" required />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">Data da Sessão</label>
                        <input type="date" value={newLic.data} onChange={e => setNewLic({ ...newLic, data: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs" required />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">Horário</label>
                        <input type="time" value={newLic.hora} onChange={e => setNewLic({ ...newLic, hora: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs" required />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">Plataforma / Portal</label>
                        <input placeholder="Ex: ComprasNet, Licitações-e, BLL..." value={newLic.portal} onChange={e => setNewLic({ ...newLic, portal: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs" required />
                      </div>
                      <input placeholder="UF" maxLength={2} value={newLic.estado} onChange={e => setNewLic({ ...newLic, estado: e.target.value.toUpperCase() })} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs" required />
                      <input placeholder="Vlr. Estimado (R$)" value={newLic.valor} onChange={e => setNewLic({ ...newLic, valor: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-mono" />
                      <select value={newLic.empresa} onChange={e => setNewLic({ ...newLic, empresa: e.target.value })} className="bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-xs col-span-2">
                        <option value="Azul Papel">Azul Papel</option>
                        <option value="Mac Copiadora">Mac Copiadora</option>
                        <option value="Azul Tec">Azul Tec</option>
                      </select>
                      <button type="submit" className="col-span-2 py-4 bg-[#0A2342] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/10 border border-[#C5A059]/30">Cadastrar e Sincronizar Agenda</button>
                    </form>
                  </div>

                  {/* Card de Meta movido para Gestão Operacional */}
                  <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 shadow-2xl flex flex-col justify-center">
                    <h4 className="text-white font-black text-sm uppercase mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      Automação Nexus: Meta de Arremate
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Alvo Financeiro Global (R$)</label>
                        <div className="flex flex-col gap-4">
                          <input
                            type="text"
                            value={targetGoal.toString()}
                            onChange={e => setTargetGoal(parseFloat(e.target.value) || 0)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-3xl font-black font-mono outline-none focus:ring-2 focus:ring-blue-600 text-center"
                          />
                          <button onClick={handleUpdateMeta} disabled={isSaving} className="w-full py-5 bg-[#0A2342] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-slate-900 transition-all border border-[#C5A059]/30 disabled:opacity-50">
                            {isSaving ? 'Sincronizando...' : 'Publicar Nova Meta Nexus'}
                          </button>
                        </div>
                        <p className="mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                          Esta configuração impacta o Monitor Inteligente de todos os clientes em tempo real (Meta Mensal).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.03] text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-6">Processo Nexus</th>
                          <th className="px-8 py-6 text-center">Status</th>
                          <th className="px-8 py-6">R$ Valores</th>
                          <th className="px-8 py-6 text-right">Documentação (Clique p/ Anexar)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {licitacoes.map(l => (
                          <tr key={l.id} className="text-xs group hover:bg-white/[0.01] transition-all">
                            <td className="px-8 py-6">
                              <p className="font-bold text-blue-400 uppercase leading-none mb-1">{l.empresa}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{l.numero} • {l.orgao}</p>
                              <div className="flex flex-col items-start gap-1 mt-2">
                                <span className="text-[9px] font-black text-[#C5A059] uppercase bg-[#C5A059]/10 px-2 py-0.5 rounded-md w-fit">
                                  {l.data.split('-').reverse().join('/')} às {l.hora || '09:00'}
                                </span>
                                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest ml-1">Portal: {l.portal || 'N/I'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <button onClick={() => setEditingLicId(l.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all hover:scale-105 ${['Ganhou', 'Homologado'].includes(l.resultado) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : l.resultado === 'Desclassificado' ? 'bg-red-500/10 text-red-500 border-red-500/20' : l.resultado === 'Em Recurso' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'
                                  }`}>{l.resultado}</button>
                                <button onClick={() => handleDeleteLicitacao(l.id)} className="group flex items-center gap-1 text-[8px] font-bold text-red-500/50 hover:text-red-400 uppercase tracking-wider transition-colors">
                                  <svg className="w-3 h-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Excluir
                                </button>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-black uppercase text-slate-600">Est</span>
                                  <input id={`est-${l.id}`} defaultValue={l.valor?.toFixed(2).replace('.', ',')} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white w-24 outline-none" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-black uppercase text-slate-600">Gan</span>
                                  <input id={`ganh-${l.id}`} defaultValue={l.valorGanho?.toFixed(2).replace('.', ',')} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-emerald-400 w-24 outline-none" />
                                </div>
                                <button onClick={() => handleSaveValues(l.id)} className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 rounded-lg text-[8px] font-black uppercase hover:bg-[#C5A059] hover:text-[#0A2342] transition-all">Salvar R$</button>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2 items-center">
                                {(['Edital', 'Proposta', 'Folder'] as DocumentoPDF['tipo'][]).map((type) => {
                                  const hasDoc = l.documentos?.some(d => d.tipo === type);
                                  return (
                                    <button
                                      key={type}
                                      onClick={(e) => { e.stopPropagation(); triggerFilePicker(type, l.id); }}
                                      className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${hasDoc ? 'bg-[#C5A059] border-[#C5A059]/20 text-[#0A2342] shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                      <span className="text-[9px] font-black uppercase">{type}</span>
                                    </button>
                                  );
                                })}

                                {l.resultado === 'Em Recurso' && (['Recurso', 'Contra Razão'] as DocumentoPDF['tipo'][]).map((type) => {
                                  const hasDoc = l.documentos?.some(d => d.tipo === type);
                                  return (
                                    <button
                                      key={type}
                                      onClick={() => triggerFilePicker(type, l.id)}
                                      className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all animate-fade-in ${hasDoc ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all'
                                        }`}
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9a5.002 5.002 0 016.001 0M6 7l3-3 3 3m0 0l3 9a5.002 5.002 0 01-6.001 0" /></svg>
                                      <span className="text-[9px] font-black uppercase">{type}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-10 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Desempenho Global vs Meta Nexus</span>
                      <span className="text-2xl font-black text-[#C5A059]">{Math.round(stats.percentualMeta)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="bg-gradient-to-r from-[#0A2342] to-[#C5A059] h-full rounded-full transition-all duration-1000 shadow-xl shadow-[#0A2342]/20"
                        style={{ width: `${Math.min(100, stats.percentualMeta)}%` }}
                      />
                    </div>
                    <p className="mt-3 text-[9px] text-slate-500 uppercase tracking-widest font-black text-right">
                      Meta Definida: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(targetGoal)}
                    </p>
                  </div>
                  <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 flex items-center justify-center text-center">
                    <div>
                      <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-2 opacity-50">Volume Provisionado</h4>
                      <p className="text-3xl font-black text-white font-mono">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.volume)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 glass p-8 rounded-[2.5rem] border border-white/5">
                    <h4 className="text-white font-black text-sm uppercase mb-6">Novo Faturamento Nexus</h4>
                    <form onSubmit={handleAddContrato} className="space-y-4">
                      <select value={newContrato.empresa} onChange={e => setNewContrato({ ...newContrato, empresa: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-xs font-bold">
                        <option value="Azul Tec">Azul Tec</option>
                        <option value="Azul Papel">Azul Papel</option>
                        <option value="Mac Copiadora">Mac Copiadora</option>
                      </select>
                      <input type="text" placeholder="Valor do Faturamento (R$)" value={newContrato.valor} onChange={e => setNewContrato({ ...newContrato, valor: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-mono" />
                      <input type="date" value={newContrato.vencimento} onChange={e => setNewContrato({ ...newContrato, vencimento: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-mono" />
                      <button type="submit" className="w-full py-4 bg-[#0A2342] text-white rounded-xl font-black uppercase text-[10px] shadow-lg shadow-slate-900/20 border border-[#C5A059]/20 hover:bg-slate-900">Arquivar Título</button>
                    </form>
                  </div>
                  <div className="lg:col-span-2 glass rounded-[2.5rem] overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-[9px] font-black uppercase text-slate-500">
                          <tr>
                            <th className="p-6">Empresa Nexus</th>
                            <th className="p-6">Vlr. Provisionado</th>
                            <th className="p-6 text-center">Data Venc.</th>
                            <th className="p-6 text-right">Comprovante</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {contratos.map(c => (
                            <tr key={c.id} className="text-xs hover:bg-white/[0.02] transition-colors">
                              <td className="p-6 font-bold text-blue-400 uppercase">{c.empresa}</td>
                              <td className="p-6 font-mono text-white text-sm">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.valor)}</td>
                              <td className="p-6 text-center font-mono text-emerald-400 font-bold">{c.proximoVencimento.split('-').reverse().join('/')}</td>
                              <td className="p-6 text-right">
                                {c.comprovanteUrl ? (
                                  <button onClick={() => window.open(c.comprovanteUrl, '_blank')} className="text-emerald-500 text-[9px] font-black uppercase bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">Ver Comprovante</button>
                                ) : (
                                  <button onClick={() => triggerFilePicker('Comprovante', c.id)} className="text-[#C5A059] text-[9px] font-black uppercase border border-[#C5A059]/20 px-4 py-2 rounded-xl hover:bg-[#C5A059] hover:text-[#0A2342] transition-all">Anexar PDF</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
            }
          </div >
        );

      case 'monitor':
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Licitações Feitas" value={stats.total.toString()} trend="Volume Nexus" color="blue" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              <StatCard label="Arremate vs Meta" value={`${Math.round(stats.percentualMeta)}%`} trend="Nexus Goal" color="indigo" icon="M13 10V3L4 14h7v7l9-11h-7z" />
              <StatCard label="Total Arrematado" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.volume)} trend="Capital Nexus" color="emerald" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
              <StatCard label="Índice Desclassificação" value={`${Math.round(stats.percDesclassificadas)}%`} trend="Taxa de Erro" color="amber" icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Coluna de Últimas Licitações agora à esquerda e com mais destaque */}
              <div className="lg:col-span-7 glass p-8 rounded-[2.5rem] shadow-2xl border border-white/5">
                <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-widest">Últimas Licitações Feitas</h3>
                <div className="space-y-5">
                  {companyLicitacoes.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5 transition-all hover:bg-white/[0.08] group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 ${['Ganhou', 'Homologado'].includes(item.resultado) ? 'bg-emerald-500/10 text-emerald-500' :
                            ['Em Recurso', 'Recurso'].includes(item.resultado) ? 'bg-indigo-500/10 text-indigo-400' :
                              'bg-blue-600/10 text-blue-400'
                            } rounded-xl flex items-center justify-center font-black text-[10px] uppercase border border-white/5`}>
                            {item.estado}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase group-hover:text-blue-400 transition-colors leading-none mb-1">{item.numero} • {item.orgao}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[#C5A059] uppercase">{item.empresa}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${['Ganhou', 'Homologado'].includes(item.resultado) ? 'bg-emerald-500/20 text-emerald-400' :
                                ['Em Recurso', 'Recurso'].includes(item.resultado) ? 'bg-indigo-500/20 text-indigo-400' :
                                  'bg-white/5 text-slate-400'
                                }`}>{item.resultado}</span>
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">Portal: {item.portal || 'Sessão Nexus'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-white leading-none mb-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor || 0)}</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase">Estimado</p>
                          {item.valorGanho && item.valorGanho > 0 && (
                            <div className="mt-2 animate-fade-in">
                              <p className="text-xs font-black text-emerald-400 leading-none mb-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorGanho)}</p>
                              <p className="text-[9px] font-bold text-emerald-500/60 uppercase">Ganho Real</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.resultado === 'Desclassificado' && item.motivoDesclassificacao && (
                        <div className="mt-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-bold uppercase flex items-start gap-4 animate-fade-in">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          </div>
                          <div><span className="text-white block mb-1">Motivo Nexus:</span> {item.motivoDesclassificacao}</div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        {Array.from(new Set(item.documentos?.map(d => d.tipo)))
                          .filter(type => ['Edital', 'Proposta', 'Folder'].includes(type as any))
                          .map(type => {
                            const doc = item.documentos?.find(d => d.tipo === type);
                            if (!doc) return null;
                            return (
                              <button key={doc.id} onClick={(e) => { e.stopPropagation(); window.open(doc.url, '_blank'); }} className="px-4 py-2 bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-black uppercase rounded-xl border border-[#C5A059]/20 hover:bg-[#C5A059] hover:text-[#0A2342] transition-all shadow-xl">
                                {doc.tipo}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 glass p-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl border border-white/5 relative">
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-widest">Arremate vs Meta</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-10 leading-relaxed">
                    Alvo Nexus: <span className="text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(targetGoal)}</span>
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={goalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={450}
                      >
                        {goalData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index]}
                            style={{ filter: index === 0 ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' : 'none' }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <h2 className="text-3xl font-black text-white leading-none">{Math.round(stats.percentualMeta)}%</h2>
                    <p className="text-[8px] font-black text-slate-500 uppercase mt-1">Concluído</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Ganho Real</span>
                    <span className="text-xs font-black text-emerald-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.volume)}</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Gap Restante</span>
                    <span className="text-xs font-black text-slate-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, targetGoal - stats.volume))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="animate-fade-in space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <FilterGroup label="Filtro Status" value={statusFilter} onChange={setStatusFilter} options={['Todas', 'Ganhou', 'Pendente', 'Perdeu', 'Desclassificado', 'Em Recurso', 'Recurso', 'Adiada']} />
              <FilterGroup label="UF" value={regionFilter} onChange={setRegionFilter} options={['Todas', 'SP', 'RJ', 'DF', 'PR', 'MG', 'BA', 'RS', 'PE']} />
              <div className="lg:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Localizar Processo</label>
                <input type="text" placeholder="Pesquisar histórico por órgão ou edital..." className="w-full bg-slate-900 border border-white/10 text-white text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C5A059]/20" value={organSearch} onChange={e => setOrganSearch(e.target.value)} />
              </div>
            </div>
            <div className="glass rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[9px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="p-8">Identificação / Órgão</th>
                      <th className="p-8 text-center">Status Nexus</th>
                      <th className="p-8 text-center">Valor Arrematado</th>
                      <th className="p-8 text-right">Documentos Disponíveis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {historyFilteredLicitacoes.map(lic => (
                      <tr key={lic.id} className="text-xs hover:bg-white/[0.02] transition-colors group">
                        <td className="p-8">
                          <p className="font-bold text-white uppercase leading-none mb-2">{lic.orgao}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-[#C5A059] uppercase">{lic.empresa}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <p className="text-[10px] text-slate-500 font-mono uppercase">{lic.numero} • {lic.data.split('-').reverse().join('/')}</p>
                          </div>
                          <p className="text-[8px] text-slate-600 uppercase font-black mt-1">Portal: {lic.portal || 'Sessão Nexus'}</p>
                          {lic.resultado === 'Desclassificado' && lic.motivoDesclassificacao && (
                            <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[9px] text-rose-400 font-black uppercase flex items-center gap-2">
                              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              Motivo: {lic.motivoDesclassificacao}
                            </div>
                          )}
                        </td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${['Ganhou', 'Homologado'].includes(lic.resultado) ? 'bg-emerald-500/10 text-emerald-500' :
                            lic.resultado === 'Desclassificado' ? 'bg-rose-500/10 text-rose-500' :
                              ['Em Recurso', 'Recurso'].includes(lic.resultado) ? 'bg-indigo-500/10 text-indigo-400' :
                                'bg-[#C5A059]/10 text-[#C5A059]'
                            }`}>{lic.resultado}</span>
                        </td>
                        <td className="p-8 text-center">
                          <span className={`text-sm font-mono font-black ${['Ganhou', 'Homologado'].includes(lic.resultado) ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {lic.valorGanho ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lic.valorGanho) : '---'}
                          </span>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex justify-end gap-2 flex-wrap max-w-[300px] ml-auto">
                            {Array.from(new Set(lic.documentos?.map(d => d.tipo))).map(type => {
                              const doc = lic.documentos?.find(d => d.tipo === type);
                              if (!doc) return null;
                              return (
                                <button key={doc.id} onClick={() => window.open(doc.url, '_blank')} className={`px-3 py-2 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-[#C5A059] hover:text-[#0A2342] transition-all shadow-xl flex items-center gap-2 ${['Recurso', 'Contra Razão'].includes(doc.tipo as any) ? 'border-[#C5A059]/30 text-[#C5A059]' : ''}`}>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                  {doc.tipo}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="animate-fade-in space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-xl uppercase tracking-tighter">Agenda Operacional Local</h3>
              <input type="date" value={agendaDate} onChange={e => setAgendaDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-[#C5A059]/20" />
            </div>
            <div className="glass rounded-[3rem] p-10 space-y-6 shadow-2xl border border-white/5">
              {dailyAgendaEvents.length > 0 ? (
                dailyAgendaEvents.map(ev => (
                  <div key={ev.id} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-xl">
                    <div className="flex items-center gap-10">
                      <div className="text-center min-w-[70px]">
                        <p className="text-3xl font-black text-white leading-none tracking-tighter">{ev.hora}</p>
                        <p className="text-[9px] text-blue-500 font-black uppercase mt-1 tracking-widest">Início</p>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold text-white uppercase leading-tight group-hover:text-blue-400 transition-colors">{ev.objeto}</h5>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{ev.empresa}</p>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">PORTAL: {ev.portal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                  <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">Sem sessões virtuais agendadas.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="animate-fade-in space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter">Desempenho Anual: Azul Papel</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Meta Mensal: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(targetGoal)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Alvo Anual 2024</span>
                <p className="text-2xl font-black text-white font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(targetGoal * 12)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monthlySalesData.map((month, i) => (
                <div key={i} className={`glass p-8 rounded-[2.5rem] border ${month.goalMet ? 'border-emerald-500/20 shadow-emerald-500/5' : 'border-rose-500/20 shadow-rose-500/5'} transition-all hover:-translate-y-2 group relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 transition-transform group-hover:scale-150 ${month.goalMet ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{month.name}</span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${month.goalMet ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                        {month.goalMet ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className={`text-2xl font-black font-mono tracking-tighter ${month.goalMet ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(month.total)}
                      </p>
                      <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Performance</span>
                        <span className={`text-[8px] font-black uppercase ${month.goalMet ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {Math.round((month.total / month.target) * 100)}% do Alvo
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${month.goalMet ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (month.total / month.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      {!isLoggedIn ? (
        <div className="bg-white text-slate-900"><Navbar onLoginSuccess={handleLoginSuccess} /><Hero /><Services /><Process /><Contact /><Footer /></div>
      ) : (
        <div className="flex h-screen bg-[#020617] text-slate-400 overflow-hidden font-jakarta">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} isAdmin={isAdmin} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative custom-scrollbar">
            <div className="max-w-[1600px] mx-auto space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-8 bg-[#C5A059] rounded-full shadow-lg shadow-[#C5A059]/20"></div>
                    <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em]">{isAdmin ? 'ADMIN ALPHA CONSOLE' : `AMBIENTE: ${selectedCompany}`}</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase flex items-center gap-4">
                    Nexus <span className="text-[#C5A059] italic">Assessoria em Licitações</span>
                  </h2>
                </div>
                <div className="bg-white/5 p-1.5 rounded-[2rem] border border-white/5 flex gap-1 shadow-2xl backdrop-blur-xl">
                  {['TODAS', 'Azul Papel', 'Mac Copiadora', 'Azul Tec'].map(c => <button key={c} onClick={() => setSelectedCompany(c)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCompany === c ? 'bg-[#C5A059] text-[#0A2342] shadow-xl shadow-[#C5A059]/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{c}</button>)}
                </div>
              </div>
              {renderDashboardContent()}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; trend: string; color: string; icon: string }> = ({ label, value, trend, color, icon }) => {
  const styles: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };
  return (
    <div className="p-8 rounded-[3rem] glass transition-all hover:-translate-y-2 group shadow-2xl border border-white/5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-2xl ${styles[color]}`}><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} /></svg></div>
      <div className="text-4xl font-extrabold text-white mb-2 tracking-tighter">{value}</div>
      <div className="flex items-center justify-between"><span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span><span className="text-[9px] font-black text-slate-300 uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">{trend}</span></div>
    </div>
  );
};

const FilterGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{label}</label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-900 border border-white/10 text-white text-xs rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#C5A059]/20 outline-none appearance-none font-bold uppercase cursor-pointer hover:bg-slate-800 transition-colors">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="w-4 h-4 text-slate-600 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);

export default App;
