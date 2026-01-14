import React, { useEffect, useState, useMemo } from 'react';
import { CertidaoForm } from '../types';
import {
  Loader2,
  RefreshCw,
  FileX,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const DATA_URL =
  'https://script.google.com/macros/s/AKfycby39qHh9vnp7-AsXpKr2uXeoL-RnOeXCOK7pZ9Y8hl1scsucOvN0bFOZzWSRAhU9ziXvw/exec';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof CertidaoForm | null;
  direction: SortDirection;
}

export const CertidaoList: React.FC = () => {
  const [data, setData] = useState<CertidaoForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(DATA_URL, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      const list = Array.isArray(result) ? result : result.data || [];

      setData(list);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(
        'Não foi possível carregar a lista de certidões. Verifique sua conexão.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const key = sortConfig.key as keyof CertidaoForm;
      const aValue = a[key] ? String(a[key]).toLowerCase() : '';
      const bValue = b[key] ? String(b[key]).toLowerCase() : '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof CertidaoForm) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: keyof CertidaoForm) => {
    if (sortConfig.key !== columnKey) {
      return (
        <ArrowUpDown className="w-4 h-4 ml-1 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
    );
  };

  const TableHeader = ({
    label,
    columnKey,
  }: {
    label: string;
    columnKey: keyof CertidaoForm;
  }) => (
    <th
      className="px-6 py-3 font-medium cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors select-none"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center justify-between">
        {label}
        {getSortIcon(columnKey)}
      </div>
    </th>
  );

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

      {/* wrapper com scroll */}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
        {sortedData.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Nenhuma certidão encontrada na base.
          </div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <TableHeader label="Empresa / Resp." columnKey="empresa" />
                <TableHeader label="CNPJ" columnKey="cnpj" />
                <TableHeader label="Tipo" columnKey="tipoDocumento" />
                <TableHeader label="Órgão" columnKey="orgao" />
                <TableHeader label="Vencimento" columnKey="fimVigencia" />
                <TableHeader label="Antecendência (dias)" columnKey="antecedenciaDias" />
                <TableHeader label="Status" columnKey="statusNovoVenc" />
                <TableHeader label="Gestor" columnKey="gestor" />
                <TableHeader label="Responsável" columnKey="responsavel" />

              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {sortedData.map((item, index) => (
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
                      {item.fimVigencia === 'INDETERMINADO'
                        ? 'Indeterminado'
                        : item.fimVigencia
                        ? new Date(item.fimVigencia).toLocaleDateString(
                            'pt-BR',
                            { timeZone: 'UTC' }
                          )
                        : '-'}
                    </span>
                  </td>
                  <td classname="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {ìtem.antecedenciaDias}  
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {item.statusNovoVenc}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {item.gestor}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {item.responsavel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        Total de registros: {sortedData.length}
      </div>
    </div>
  );
};
