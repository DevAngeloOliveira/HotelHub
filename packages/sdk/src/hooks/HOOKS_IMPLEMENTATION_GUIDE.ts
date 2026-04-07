/**
 * GUIA DE IMPLEMENTAÇÃO DE HOOKS
 * 
 * Este arquivo documenta o padrão para implementar hooks em apps/web e apps/mobile
 * Os hooks NÃO estão aqui porque dependem de TanStack Query (ainda não instalado no SDK)
 * 
 * ===== INSTALAÇÃO (em apps/web e apps/mobile) =====
 * 
 * npm install @tanstack/react-query @tanstack/react-query-devtools
 * 
 * ===== PADRÃO DE HOOK =====
 * 
 * import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
 * import { destinationsModule } from '@hotelhub/sdk'
 * import { queryKeys } from '@hotelhub/sdk'
 * 
 * export function useDestinationsList(filters) {
 *   return useQuery({
 *     queryKey: queryKeys.destinations.list(filters),
 *     queryFn: () => destinationsModule.list(filters),
 *     staleTime: 1000 * 60 * 5, // 5 min
 *     // retry: true,
 *     // enabled: !!somePrecondition,
 *   })
 * }
 * 
 * export function useDestinationDetail(id) {
 *   return useQuery({
 *     queryKey: queryKeys.destinations.detail(id),
 *     queryFn: () => destinationsModule.getDetail(id),
 *     staleTime: 1000 * 60 * 10, // 10 min
 *   })
 * }
 * 
 * export function useCreateReservation() {
 *   const queryClient = useQueryClient()
 *   
 *   return useMutation({
 *     mutationFn: (data) => reservationsModule.create(data),
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all })
 *       toast.success('Reserva criada!')
 *     },
 *     onError: (error) => {
 *       toast.error(error.message)
 *     },
 *   })
 * }
 * 
 * ===== RULES =====
 * 
 * 1. Sempre use queryKeys factory para consistency
 * 2. staleTime depende do dado:
 *    - Destinos/Hotels (mudam pouco): 5-10 min
 *    - Minhas reservas (pessoal): 1-2 min
 *    - Disponibilidade (crítico): 30s max
 * 3. Mutations sempre invalidateQueries ao sucesso
 * 4. Error handling com try-catch ou onError
 * 5. Loading states com isPending/isLoading
 * 
 * ===== EXEMPLO COMPLETO (em apps/web/src/hooks/use-destinations.ts) =====
 * 
 * import { useQuery } from '@tanstack/react-query'
 * import { destinationsModule, queryKeys } from '@hotelhub/sdk'
 * 
 * export function useDestinationsList(page = 0, size = 20) {
 *   return useQuery({
 *     queryKey: queryKeys.destinations.list({ page, size }),
 *     queryFn: () => destinationsModule.list({ page, size }),
 *     staleTime: 1000 * 60 * 5,
 *   })
 * }
 * 
 * Uso em componente:
 * 
 * export function DestinationsPage() {
 *   const { data, isLoading, error } = useDestinationsList()
 *   
 *   if (isLoading) return <LoadingState />
 *   if (error) return <ErrorState error={error} />
 *   
 *   return (
 *     <div>
 *       {data?.content.map(d => (
 *         <DestinationCard key={d.id} destination={d} />
 *       ))}
 *     </div>
 *   )
 * }
 */
