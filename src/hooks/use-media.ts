import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ApiSuccess } from "../types/api";

export interface MediaAsset {
  id: string;
  url: string;
  type: string;
  title: string;
  createdAt: string;
  mimeType: string;
}

export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: async (): Promise<MediaAsset[]> => {
      const response = await apiClient.api.get<ApiSuccess<MediaAsset[]>>("/media");
      return response.data.data;
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File): Promise<MediaAsset> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.api.post<ApiSuccess<MediaAsset>>(
        "/media/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}
