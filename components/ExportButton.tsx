'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Props {
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export function ExportButton({ onExportExcel, onExportPDF }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Exportar Relatório">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Escolha o formato de exportação:</p>

          <Button onClick={() => { onExportExcel(); setIsOpen(false); }} fullWidth>
            📊 Exportar para Excel (.xlsx)
          </Button>

          <Button onClick={() => { onExportPDF(); setIsOpen(false); }} variant="secondary" fullWidth>
            📄 Exportar para PDF
          </Button>
        </div>
      </Modal>
    </>
  );
}
