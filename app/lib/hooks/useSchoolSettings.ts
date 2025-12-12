import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchoolSettings, updateSchoolSettings, SchoolSettings } from '@/lib/settings-service';
import { toast } from 'sonner';

export function useSchoolSettings() {
  return useQuery({
    queryKey: ['school-settings'],
    queryFn: getSchoolSettings,
  });
}

export function useUpdateSchoolSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSchoolSettings,
    onSuccess: () => {
      toast.success('School settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['school-settings'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });
}
