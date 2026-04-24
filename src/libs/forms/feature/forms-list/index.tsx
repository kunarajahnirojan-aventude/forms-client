import { FormsListView } from '@/libs/forms/ui/forms-list';
import { useForms } from '@/libs/forms/hooks/use-forms';
import { useImportForm } from '@/libs/forms/hooks/use-import-form';

export default function FormsListPage() {
  const {
    filteredForms,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    handleDelete,
    handleDuplicate,
    handleStatusChange,
    handleCopyLink,
  } = useForms();

  const { importAndSave } = useImportForm();

  return (
    <FormsListView
      forms={filteredForms}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      onSearchChange={setSearchQuery}
      onStatusFilterChange={setStatusFilter}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onStatusChange={handleStatusChange}
      onCopyLink={handleCopyLink}
      onImport={importAndSave}
    />
  );
}
