import { fetchSelectionCategories } from "@/http/selectionCategory.api"
import { ISelectionCategory } from "@/models/selection.model"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

const useFetchSelectionCategories = (): UseQueryResult<ISelectionCategory[]> => {
    return useQuery<ISelectionCategory[]>({
        queryKey: ['selectionCategories'],
        queryFn: () => fetchSelectionCategories(),
    })
}

export default useFetchSelectionCategories
