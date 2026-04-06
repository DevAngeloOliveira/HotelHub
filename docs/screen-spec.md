# Screen Spec (Web + Mobile)

## Web (Next.js)

1. `WEB/Home`
   - Hero com busca por destino
   - Seção destinos em destaque
   - CTA para autenticação
2. `WEB/DestinationsList`
   - Grid paginado de destinos
   - Filtros: nome, cidade, estado, país, categoria
3. `WEB/DestinationDetail`
   - Banner + descrição + hotéis vinculados
4. `WEB/HotelDetail`
   - Conteúdo do hotel + quartos
5. `WEB/RoomAvailability`
   - Filtros de período e hóspedes
   - Lista de quartos disponíveis
6. `WEB/ReservationCheckout`
   - Resumo da reserva
   - Confirmação
7. `WEB/MyReservations`
   - Histórico e cancelamento
8. `WEB/AdminDashboard`
   - Acesso para CRUDs administrativos

## Mobile (React Native)

1. `MOB/Home`
2. `MOB/DestinationsList`
3. `MOB/DestinationDetail`
4. `MOB/HotelDetail`
5. `MOB/RoomAvailability`
6. `MOB/CreateReservation`
7. `MOB/MyReservations`
8. `MOB/Profile`

## Shared design guidance

- Grid base: 8pt
- Color tokens:
  - `primary`: `#0B5FFF`
  - `success`: `#16A34A`
  - `danger`: `#DC2626`
  - `neutral-900`: `#0F172A`
  - `neutral-100`: `#F1F5F9`
- Typografia:
  - Web: `Inter`
  - Mobile: `Inter`
- Componentes base:
  - `Button`, `Input`, `DateRangePicker`, `Card`, `Badge`, `EmptyState`
