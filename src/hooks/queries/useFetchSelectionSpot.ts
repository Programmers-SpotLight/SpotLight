import { fetchSelectionLocations } from "@/http/selectionCategory.api"
import { ISelectionLocation } from "@/models/selection.model"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

const useFetchSelectionSpot = (): UseQueryResult<ISelectionLocation[]> => {
    return useQuery<ISelectionLocation[]>({
        queryKey: ['selectionLocations'],
        queryFn: () => fetchSelectionLocations(),
    })
}

export default useFetchSelectionSpot
