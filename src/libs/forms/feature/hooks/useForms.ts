import { useCallback } from 'react';
import { useFormsStore } from '@/store';
import type { FormStatus } from '@/libs/forms/store/types';

export function useForms() {
  const {
    forms,
    searchQuery,
    statusFilter,
    deleteForm,
    duplicateForm,
    updateForm,
    setSearchQuery,
    setStatusFilter,
  } = useFormsStore();

  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Delete this form? This cannot be undone.')) {
        deleteForm(id);
      }
    },
    [deleteForm],
  );

  const handleDuplicate = useCallback(
    (id: string) => duplicateForm(id),
    [duplicateForm],
  );

  const handleStatusChange = useCallback(
    (id: string, status: FormStatus) => updateForm(id, { status }),
    [updateForm],
  );

  const handleCopyLink = useCallback((shareToken: string) => {
    const url = `${window.location.origin}/s/${shareToken}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }, []);

  return {
    filteredForms,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    handleDelete,
    handleDuplicate,
    handleStatusChange,
    handleCopyLink,
  };
}
