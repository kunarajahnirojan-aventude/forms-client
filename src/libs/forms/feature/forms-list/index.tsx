import { FormsListView } from '@/libs/forms/ui/forms-list';
import { useForms } from '@/libs/forms/feature/hooks/useForms';

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
    />
  );
}
