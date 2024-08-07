import { fetchSelectionLocations } from "@/http/search.api"
import { ISelectionLocation } from "@/models/selection.model"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

const useFetchSelectionLocations = (): UseQueryResult<ISelectionLocation[]> => {
    return useQuery<ISelectionLocation[]>({
        queryKey: ['selectionLocations'],
        queryFn: () => fetchSelectionLocations(),
    })
}

export default useFetchSelectionLocations
