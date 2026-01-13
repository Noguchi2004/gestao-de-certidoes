import React, { useEffect, useState } from 'react';
import { CertidaoForm } from '../types';
import { Loader2, RefreshCw, FileX } from 'lucide-react';

// URL específica para Leitura (GET)
const DATA_URL = 'https://script.google.com/macros/s/AKfycbx-Dz5XIrRyrv5lcwHsgz8IwWGk6ZG0UalVZmOkrRUSnjK0Mzx3zR86R0hUjxbNjSDSdw/exec';

export const CertidaoList: React.FC = () => {
  const [data, setData] = useState<CertidaoForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      // Fetch direto ao Google Apps Script
      // redirect: 'follow' é essencial para seguir o redirecionamento do Google
      const response = await fetch(DATA_URL, {
        method: 'GET',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      // Ajuste para garantir que é um array, dependendo de como o Apps Script retorna (direto ou {data: []})
      const list = Array.isArray(result) ? result : (result.data || []);
      
      setData(list);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError('Não foi possível carregar a lista de certidões. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>Carregando base de dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900 mx-6">
        <FileX className="w-10 h-10 mb-2" />
        <p className="font-medium">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-md transition-colors text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Base de Certidões
        </h2>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          title="Atualizar lista"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Nenhuma certidão encontrada na base.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3 font-medium">Empresa / Resp.</th>
                <th className="px-6 py-3 font-medium">CNPJ</th>
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">Órgão</th>
                <th className="px-6 py-3 font-medium">Vencimento</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {data.map((item, index) => (
                <tr 
                  key={index} 
                  className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {item.empresa}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {item.cnpj}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {item.tipoDocumento}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {item.orgao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {item.fimVigencia ? new Date(item.fimVigencia).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {item.statusNovoVenc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        Total de registros: {data.length}
      </div>
    </div>
  );
};
