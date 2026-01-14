import React, { useState } from 'react';
import { FileText, Save, Loader2, CheckCircle2, AlertCircle, List, PlusCircle, Plus, X } from 'lucide-react';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { CertidaoList } from './components/CertidaoList';
import { CertidaoForm, ApiResponse, CertidaoType } from './types';
import { API_URL, DOC_TYPES, COMPANIES, COMPANY_CNPJ_MAP } from './constants';

const INITIAL_STATE: CertidaoForm = {
  empresa: '',
  cnpj: '',
  email: '',
  tipoDocumento: '',
  orgao: '',
  dataEmissao: '',
  fimVigencia: '',
  antecedenciaDias: '',
  statusNovoVenc: '',
  gestor: '',
  responsavel: '',
};

type Tab = 'cadastro' | 'consulta';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('cadastro');

  const [formData, setFormData] = useState<CertidaoForm>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // multi‑email
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // select de tipo de documento (controla a opção "Outro")
  const [selectedDocType, setSelectedDocType] = useState<string>('');

  const emailList = formData.email
    ? formData.email.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'empresa') {
      const autoCnpj = COMPANY_CNPJ_MAP[value] || '';
      setFormData(prev => ({
        ...prev,
        empresa: value,
        cnpj: autoCnpj,
      }));
    } else if (name === 'docTypeSelect') {
      // mudou o select de tipo
      setSelectedDocType(value);

      if (value === CertidaoType.OUTRO) {
        // se for "Outro", zera o campo para o usuário digitar
        setFormData(prev => ({ ...prev, tipoDocumento: '' }));
      } else {
        // se for qualquer tipo padrão, grava direto
        setFormData(prev => ({ ...prev, tipoDocumento: value }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddEmail = () => {
    if (!currentEmail) return;

    const emails = emailList;

    if (emails.length >= 5) {
      setEmailError('Limite de 5 emails atingido.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      setEmailError('Formato de email inválido.');
      return;
    }

    if (emails.includes(currentEmail)) {
      setEmailError('Este email já foi adicionado.');
      return;
    }

    const newEmails = [...emails, currentEmail];
    setFormData(prev => ({ ...prev, email: newEmails.join(', ') }));
    setCurrentEmail('');
    setEmailError('');
  };

  const removeEmail = (emailToRemove: string) => {
    const newEmails = emailList.filter(e => e !== emailToRemove);
    setFormData(prev => ({ ...prev, email: newEmails.join(', ') }));
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = {
        certidao: {
          empresa: formData.empresa,
          cnpj: formData.cnpj,
          email: formData.email,
          tipoDocumento: formData.tipoDocumento,
          orgao: formData.orgao,
          dataEmissao: formData.dataEmissao,
          fimVigencia: formData.fimVigencia,
          antecedenciaDias: formData.antecedenciaDias,
          statusNovoVenc: formData.statusNovoVenc,
          gestor: formData.gestor,
          responsael: formData.responsavel
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Resposta bruta da API:', response.status, text);

      let data: ApiResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Resposta da API não é JSON válido: ' + text);
      }

      if (data && data.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Certidão cadastrada com sucesso!',
        });
        setFormData(INITIAL_STATE);
        setCurrentEmail('');
        setSelectedDocType('');

        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 5000);
      } else {
        throw new Error(
          (data as any)?.message ||
            (data as any)?.error ||
            'Erro desconhecido ao salvar.'
        );
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Falha ao conectar com o servidor. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gestão de Certidões
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Controle unificado de documentos e vencimentos.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 inline-flex">
            <button
              onClick={() => setActiveTab('cadastro')}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'cadastro'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Cadastro
            </button>
            <button
              onClick={() => setActiveTab('consulta')}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'consulta'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              Base de Dados
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300 min-h-[500px]">
          {activeTab === 'cadastro' ? (
            <>
              {/* Status Alert Banner */}
              {submitStatus.type && (
                <div
                  className={`p-4 flex items-center gap-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-b border-green-100 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-b border-red-100 dark:border-red-800'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="font-medium">{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Empresa */}
                  <div className="col-span-1 md:col-span-2">
                    <Select
                      label="Empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      options={COMPANIES}
                      required
                    />
                  </div>

                  {/* CNPJ */}
                  <Input
                    label="CNPJ"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    required
                  />

                  {/* Emails (multi‑email) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Emails do Responsável (Máx. 5){' '}
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={currentEmail}
                          onChange={e => {
                            setCurrentEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          onKeyDown={handleEmailKeyDown}
                          placeholder="Digite um email e pressione Enter..."
                          className={`flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
                            emailList.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={emailList.length >= 5}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddEmail}
                        disabled={!currentEmail || emailList.length >= 5}
                        className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700"
                        title="Adicionar Email"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>

                    {emailError && (
                      <p className="text-xs text-red-500">{emailError}</p>
                    )}

                    <div className="flex flex-wrap gap-2 min-h-[30px] pt-1">
                      {emailList.map((email, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors focus:outline-none"
                            title="Remover email"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {emailList.length === 0 && (
                        <span className="text-xs text-slate-400 italic py-1">
                          Nenhum email adicionado.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tipo de Documento + Especificar quando Outro */}
                  <div className="flex flex-col gap-4">
                    <Select
                      label="Tipo de Documento"
                      name="docTypeSelect"
                      value={selectedDocType}
                      onChange={handleChange}
                      options={DOC_TYPES}
                      required
                    />

                    {selectedDocType === CertidaoType.OUTRO && (
                      <Input
                        label="Especificar"
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        placeholder="Digite o nome da certidão"
                        required
                      />
                    )}
                  </div>

                  {/* Órgão */}
                  <Input
                    label="Órgão Emissor"
                    name="orgao"
                    value={formData.orgao}
                    onChange={handleChange}
                    placeholder="Ex: Receita Federal"
                    required
                  />

                  {/* Data de Emissão */}
                  <Input
                    label="Data de Emissão"
                    name="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={handleChange}
                    required
                  />

                  {/* Fim da Vigência */}
                  <Input
                    label="Fim da Vigência"
                    name="fimVigencia"
                    type="date"
                    value={formData.fimVigencia}
                    onChange={handleChange}
                    required
                  />

                  {/* Antecedência para novo pedido */}
                  <Input
                    label="Dias de antecedência para renovação"
                    name="antecedenciaDias"
                    type="number"
                    min={0}
                    value={formData.antecedenciaDias}
                    onChange={handleChange}
                    placeholder="Ex.: 15"
                  />

                  {/* Status / Novo Vencimento */}
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Status / Novo Vencimento"
                      name="statusNovoVenc"
                      value={formData.statusNovoVenc}
                      onChange={handleChange}
                      placeholder="Descreva o status atual ou a nova data de vencimento"
                      required
                    />
                  </div>
                </div>

                <Input
                  label="Gestor"
                  name="gestor"
                  value={formData.gestor}
                  onChange={handleChange}
                  placeholder="Digite o nome do gestor"
                  required
                  />

                <Input
                  label="Reponsável"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  placeholder="Digite o nome do responsável"
                  required
                  />

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Salvar Certidão
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <CertidaoList />
          )}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          &copy; {new Date().getFullYear()} Sistema de Gestão Corporativa. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
