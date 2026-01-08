import React, { useState } from 'react';
import { FileText, Save, Loader2, CheckCircle2, AlertCircle, List, PlusCircle } from 'lucide-react';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { CertidaoList } from './components/CertidaoList';
import { CertidaoForm, ApiResponse } from './types';
import { API_URL, DOC_TYPES } from './constants';

const INITIAL_STATE: CertidaoForm = {
  empresa: '',
  cnpj: '',
  email: '',
  tipoDocumento: '',
  orgao: '',
  dataEmissao: '',
  fimVigencia: '',
  statusNovoVenc: ''
};

type Tab = 'cadastro' | 'consulta';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('cadastro');
  
  // State for Form
  const [formData, setFormData] = useState<CertidaoForm>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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
          statusNovoVenc: formData.statusNovoVenc
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data && data.ok) {
        setSubmitStatus({ type: 'success', message: 'Certidão cadastrada com sucesso!' });
        setFormData(INITIAL_STATE);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            setSubmitStatus({ type: null, message: '' });
        }, 5000);
      } else {
        throw new Error(data.message || 'Erro desconhecido ao salvar.');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Falha ao conectar com o servidor. Tente novamente.' 
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Gestão de Certidões</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Controle unificado de documentos e vencimentos.</p>
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
                <div className={`p-4 flex items-center gap-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-b border-green-100 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-b border-red-100 dark:border-red-800'
                }`}>
                  {submitStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span className="font-medium">{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Empresa */}
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Empresa / Responsável"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      placeholder="Razão Social ou Nome do Responsável"
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

                  {/* Email */}
                  <Input
                    label="Email do Responsável"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@empresa.com.br"
                    required
                  />

                  {/* Tipo de Documento */}
                  <Select
                    label="Tipo de Documento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    options={DOC_TYPES}
                    required
                  />

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