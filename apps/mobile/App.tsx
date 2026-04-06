import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  addDaysToToday,
  calculateReservationTotal,
  canCancelReservation,
  currentUserId,
  destinations,
  daysBetween,
  getAvailableRoomsByHotel,
  getDestinationById,
  getHotelById,
  getHotelsByDestination,
  getOverlappingConfirmedCount,
  getRoomById,
  getRoomsByHotel,
  initialProfile,
  initialReservations,
  nextReservationId,
  Reservation,
  validateReservationWindow,
} from './src/domain/hotelhub';
import { colors, radius, spacing } from './src/theme/tokens';

type Route =
  | { name: 'home' }
  | { name: 'destinations'; query?: string }
  | { name: 'destination'; destinationId: string }
  | { name: 'hotel'; hotelId: string }
  | { name: 'availability'; hotelId: string; checkInDate: string; checkOutDate: string; guestCount: number }
  | { name: 'create'; hotelId: string; roomId: string; checkInDate: string; checkOutDate: string; guestCount: number }
  | { name: 'reservations' }
  | { name: 'profile' };

type ActionResult = { ok: boolean; message: string };

function money(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Button({
  text,
  onPress,
  tone = 'primary',
}: {
  text: string;
  onPress: () => void;
  tone?: 'primary' | 'success' | 'neutral';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'success' ? styles.buttonSuccess : tone === 'neutral' ? styles.buttonNeutral : styles.buttonPrimary,
        pressed ? styles.buttonPressed : null,
      ]}
    >
      <Text style={[styles.buttonText, tone === 'neutral' ? styles.buttonTextNeutral : styles.buttonTextSolid]}>{text}</Text>
    </Pressable>
  );
}

function Input({
  label,
  value,
  onChange,
  keyboardType = 'default',
  editable = true,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  editable?: boolean;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        editable={editable}
        placeholder={placeholder}
        style={[styles.input, !editable ? styles.inputReadonly : null]}
      />
    </View>
  );
}

function Tag({ text, tone = 'neutral' }: { text: string; tone?: 'neutral' | 'success' | 'danger' }) {
  return (
    <View style={[styles.tag, tone === 'success' ? styles.tagSuccess : tone === 'danger' ? styles.tagDanger : styles.tagNeutral]}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function Empty({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.sub}>{message}</Text>
    </View>
  );
}

function title(route: Route): string {
  switch (route.name) {
    case 'home':
      return 'Inicio';
    case 'destinations':
      return 'Destinos';
    case 'destination':
      return 'Destino';
    case 'hotel':
      return 'Hotel';
    case 'availability':
      return 'Disponibilidade';
    case 'create':
      return 'Reservar';
    case 'reservations':
      return 'Minhas reservas';
    case 'profile':
      return 'Perfil';
  }
}

export default function App() {
  const [profile, setProfile] = useState(initialProfile);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const [notice, setNotice] = useState<string | null>(null);

  const route = stack[stack.length - 1];

  const myReservations = useMemo(
    () => reservations.filter((r) => r.userId === currentUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reservations]
  );

  const push = (next: Route) => {
    setNotice(null);
    setStack((prev) => [...prev, next]);
  };

  const openTab = (name: 'home' | 'reservations' | 'profile') => {
    setNotice(null);
    setStack([{ name }]);
  };

  const back = () => {
    setNotice(null);
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const cancelReservation = (reservationId: string): ActionResult => {
    const target = reservations.find((item) => item.id === reservationId && item.userId === currentUserId);
    if (!target) {
      return { ok: false, message: 'Reserva nao encontrada.' };
    }
    if (!canCancelReservation(target)) {
      return { ok: false, message: 'Cancelamento permitido apenas antes do check-in.' };
    }

    setReservations((prev) =>
      prev.map((item) => (item.id === reservationId ? { ...item, status: 'CANCELLED', cancelledAt: new Date().toISOString() } : item))
    );
    setNotice(`Reserva ${reservationId} cancelada.`);
    return { ok: true, message: 'Reserva cancelada.' };
  };

  const createReservation = (
    hotelId: string,
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    guestCount: number
  ): ActionResult => {
    const hotel = getHotelById(hotelId);
    const room = getRoomById(roomId);
    if (!hotel || !room) {
      return { ok: false, message: 'Hotel ou quarto invalido.' };
    }

    const destination = getDestinationById(hotel.destinationId);
    if (!destination || destination.status !== 'ACTIVE' || hotel.status !== 'ACTIVE' || room.status !== 'ACTIVE') {
      return { ok: false, message: 'Entidade inativa para reserva.' };
    }

    const dateError = validateReservationWindow(checkInDate, checkOutDate);
    if (dateError) {
      return { ok: false, message: dateError };
    }

    if (guestCount > room.capacity) {
      return { ok: false, message: 'Quantidade de hospedes excede a capacidade.' };
    }

    const overlaps = getOverlappingConfirmedCount(room.id, checkInDate, checkOutDate, reservations);
    if (overlaps >= room.quantity) {
      return { ok: false, message: 'Sem disponibilidade para este periodo.' };
    }

    const totalAmount = calculateReservationTotal(room, checkInDate, checkOutDate);
    if (totalAmount <= 0) {
      return { ok: false, message: 'Periodo invalido.' };
    }

    const newReservation: Reservation = {
      id: nextReservationId(),
      userId: currentUserId,
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      guestCount,
      totalAmount,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);
    openTab('reservations');
    setNotice(`Reserva ${newReservation.id} confirmada.`);
    return { ok: true, message: 'Reserva criada.' };
  };

  let content: React.ReactNode;

  if (route.name === 'home') {
    const featured = destinations.filter((d) => d.status === 'ACTIVE' && d.featured);
    content = <HomeContent featured={featured} onSearch={(query) => push({ name: 'destinations', query })} onOpenDestination={(destinationId) => push({ name: 'destination', destinationId })} onOpenReservations={() => openTab('reservations')} />;
  } else if (route.name === 'destinations') {
    content = <DestinationsContent initialQuery={route.query} onOpenDestination={(destinationId) => push({ name: 'destination', destinationId })} />;
  } else if (route.name === 'destination') {
    const destination = getDestinationById(route.destinationId);
    if (!destination || destination.status !== 'ACTIVE') {
      content = <Empty title='Destino nao encontrado' message='Selecione outro destino.' />;
    } else {
      const destinationHotels = getHotelsByDestination(destination.id);
      content = (
        <View style={styles.gap}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>MOB/DestinationDetail</Text>
            <View style={styles.rowBetween}><Text style={styles.cardTitle}>{destination.name}</Text><Tag text={destination.category} tone='success' /></View>
            <Text style={styles.sub}>{destination.city}, {destination.state} - {destination.country}</Text>
            <Text style={styles.body}>{destination.description}</Text>
          </View>
          <Text style={styles.sectionTitle}>Hoteis vinculados</Text>
          {destinationHotels.map((hotel) => (
            <Pressable key={hotel.id} style={styles.card} onPress={() => push({ name: 'hotel', hotelId: hotel.id })}>
              <View style={styles.rowBetween}><Text style={styles.cardTitle}>{hotel.name}</Text><Tag text={hotel.category} /></View>
              <Text style={styles.sub}>{hotel.address}</Text>
              <Text style={styles.body}>{hotel.description}</Text>
            </Pressable>
          ))}
        </View>
      );
    }
  } else if (route.name === 'hotel') {
    const hotel = getHotelById(route.hotelId);
    if (!hotel || hotel.status !== 'ACTIVE') {
      content = <Empty title='Hotel nao encontrado' message='Selecione outro hotel.' />;
    } else {
      const hotelRooms = getRoomsByHotel(hotel.id);
      const checkInDate = addDaysToToday(7);
      const checkOutDate = addDaysToToday(10);
      content = (
        <View style={styles.gap}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>MOB/HotelDetail</Text>
            <View style={styles.rowBetween}><Text style={styles.cardTitle}>{hotel.name}</Text><Tag text={hotel.category} tone='success' /></View>
            <Text style={styles.sub}>{hotel.address}</Text>
            <Text style={styles.body}>{hotel.description}</Text>
            <View style={styles.wrap}>{hotel.amenities.map((amenity) => <Tag key={amenity} text={amenity} />)}</View>
            <Button text='Ver disponibilidade' onPress={() => push({ name: 'availability', hotelId: hotel.id, checkInDate, checkOutDate, guestCount: 2 })} />
          </View>
          {hotelRooms.map((room) => (
            <View key={room.id} style={styles.card}>
              <View style={styles.rowBetween}><Text style={styles.cardTitle}>{room.name}</Text><Tag text={room.type} /></View>
              <Text style={styles.body}>{room.description}</Text>
              <Text style={styles.sub}>Capacidade: {room.capacity} | Estoque: {room.quantity} | Diaria: {money(room.pricePerNight)}</Text>
            </View>
          ))}
        </View>
      );
    }
  } else if (route.name === 'availability') {
    content = <AvailabilityContent route={route} reservations={reservations} onSelectRoom={(roomId, checkInDate, checkOutDate, guestCount) => push({ name: 'create', hotelId: route.hotelId, roomId, checkInDate, checkOutDate, guestCount })} />;
  } else if (route.name === 'create') {
    const hotel = getHotelById(route.hotelId);
    const room = getRoomById(route.roomId);
    if (!hotel || !room) {
      content = <Empty title='Dados invalidos' message='Selecione novamente o quarto.' />;
    } else {
      const nights = daysBetween(route.checkInDate, route.checkOutDate);
      const total = calculateReservationTotal(room, route.checkInDate, route.checkOutDate);
      content = (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>MOB/CreateReservation</Text>
          <Text style={styles.cardTitle}>{hotel.name}</Text>
          <Text style={styles.sub}>{hotel.address}</Text>
          <Text style={styles.body}>Quarto: {room.name}</Text>
          <Text style={styles.body}>Check-in: {route.checkInDate}</Text>
          <Text style={styles.body}>Check-out: {route.checkOutDate}</Text>
          <Text style={styles.body}>Hospedes: {route.guestCount}</Text>
          <Text style={styles.body}>Noites: {nights}</Text>
          <Text style={styles.total}>Total: {money(total)}</Text>
          <Button text='Confirmar reserva' tone='success' onPress={() => createReservation(route.hotelId, route.roomId, route.checkInDate, route.checkOutDate, route.guestCount)} />
        </View>
      );
    }
  } else if (route.name === 'reservations') {
    if (myReservations.length === 0) {
      content = <Empty title='Sem reservas' message='Suas reservas aparecerao aqui.' />;
    } else {
      content = (
        <View style={styles.gap}>
          <Text style={styles.sectionTitle}>MOB/MyReservations</Text>
          {myReservations.map((reservation) => {
            const hotel = getHotelById(reservation.hotelId);
            const room = getRoomById(reservation.roomId);
            const canCancel = canCancelReservation(reservation);
            return (
              <View key={reservation.id} style={styles.card}>
                <View style={styles.rowBetween}><Text style={styles.cardTitle}>{reservation.id}</Text><Tag text={reservation.status} tone={reservation.status === 'CONFIRMED' ? 'success' : 'danger'} /></View>
                <Text style={styles.body}>Hotel: {hotel?.name ?? 'Hotel'}</Text>
                <Text style={styles.body}>Quarto: {room?.name ?? 'Quarto'}</Text>
                <Text style={styles.sub}>{reservation.checkInDate} ate {reservation.checkOutDate} | {reservation.guestCount} hospedes</Text>
                <Text style={styles.sub}>Total: {money(reservation.totalAmount)}</Text>
                {canCancel ? <Button text='Cancelar reserva' tone='neutral' onPress={() => cancelReservation(reservation.id)} /> : <Text style={styles.locked}>Cancelamento indisponivel para esta reserva.</Text>}
              </View>
            );
          })}
        </View>
      );
    }
  } else {
    content = <ProfileContent profile={profile} onSave={(name, phone) => { setProfile((prev) => ({ ...prev, name: name.trim() || prev.name, phone: phone.trim() || prev.phone })); setNotice('Perfil atualizado com sucesso.'); }} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style='light' />
      <View style={styles.container}>
        <View style={styles.header}>
          {stack.length > 1 ? <Button text='Voltar' tone='neutral' onPress={back} /> : <View style={{ width: 90 }} />}
          <Text style={styles.headerTitle}>{title(route)}</Text>
          <Tag text={profile.role} />
        </View>

        {notice ? (
          <View style={styles.notice}><Text style={styles.noticeText}>{notice}</Text></View>
        ) : null}

        <ScrollView contentContainerStyle={styles.content}>{content}</ScrollView>

        <View style={styles.nav}>
          <Pressable style={[styles.navItem, route.name === 'home' ? styles.navItemActive : null]} onPress={() => openTab('home')}><Text style={[styles.navText, route.name === 'home' ? styles.navTextActive : null]}>Inicio</Text></Pressable>
          <Pressable style={[styles.navItem, route.name === 'reservations' ? styles.navItemActive : null]} onPress={() => openTab('reservations')}><Text style={[styles.navText, route.name === 'reservations' ? styles.navTextActive : null]}>Reservas</Text></Pressable>
          <Pressable style={[styles.navItem, route.name === 'profile' ? styles.navItemActive : null]} onPress={() => openTab('profile')}><Text style={[styles.navText, route.name === 'profile' ? styles.navTextActive : null]}>Perfil</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeContent({ featured, onSearch, onOpenDestination, onOpenReservations }: { featured: typeof destinations; onSearch: (query: string) => void; onOpenDestination: (destinationId: string) => void; onOpenReservations: () => void; }) {
  const [query, setQuery] = useState('');
  return (
    <View style={styles.gap}>
      <View style={[styles.card, styles.hero]}>
        <Text style={styles.heroTag}>MOB/Home</Text>
        <Text style={styles.heroTitle}>HotelHub</Text>
        <Text style={styles.heroText}>Descubra destinos e reserve sem overbooking.</Text>
        <Input label='Buscar destino' value={query} onChange={setQuery} placeholder='Ex.: Porto Seguro' />
        <Button text='Buscar destinos' onPress={() => onSearch(query)} />
        <Button text='Minhas reservas' tone='neutral' onPress={onOpenReservations} />
      </View>
      <Text style={styles.sectionTitle}>Destinos em destaque</Text>
      {featured.map((destination) => (
        <Pressable key={destination.id} style={styles.card} onPress={() => onOpenDestination(destination.id)}>
          <View style={styles.rowBetween}><Text style={styles.cardTitle}>{destination.name}</Text><Tag text={destination.category} tone='success' /></View>
          <Text style={styles.sub}>{destination.city}, {destination.state} - {destination.country}</Text>
          <Text style={styles.body}>{destination.description}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function DestinationsContent({ initialQuery, onOpenDestination }: { initialQuery?: string; onOpenDestination: (destinationId: string) => void; }) {
  const [nameFilter, setNameFilter] = useState(initialQuery ?? '');
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredDestinations = destinations.filter((destination) => {
    if (destination.status !== 'ACTIVE') return false;
    if (nameFilter.trim() && !destination.name.toLowerCase().includes(nameFilter.trim().toLowerCase())) return false;
    if (cityFilter.trim() && !destination.city.toLowerCase().includes(cityFilter.trim().toLowerCase())) return false;
    if (categoryFilter.trim() && !destination.category.toLowerCase().includes(categoryFilter.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.gap}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>MOB/DestinationsList</Text>
        <Input label='Nome' value={nameFilter} onChange={setNameFilter} />
        <Input label='Cidade' value={cityFilter} onChange={setCityFilter} />
        <Input label='Categoria' value={categoryFilter} onChange={setCategoryFilter} />
      </View>
      {filteredDestinations.length === 0 ? <Empty title='Nenhum destino encontrado' message='Ajuste os filtros para buscar outras opcoes.' /> : filteredDestinations.map((destination) => (
        <Pressable key={destination.id} style={styles.card} onPress={() => onOpenDestination(destination.id)}>
          <View style={styles.rowBetween}><Text style={styles.cardTitle}>{destination.name}</Text><Tag text={destination.category} tone='success' /></View>
          <Text style={styles.sub}>{destination.city}, {destination.state} - {destination.country}</Text>
          <Text style={styles.body}>{destination.description}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function AvailabilityContent({ route, reservations, onSelectRoom }: { route: Extract<Route, { name: 'availability' }>; reservations: Reservation[]; onSelectRoom: (roomId: string, checkInDate: string, checkOutDate: string, guestCount: number) => void; }) {
  const hotel = getHotelById(route.hotelId);
  const [checkInDate, setCheckInDate] = useState(route.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState(route.checkOutDate);
  const [guestCountInput, setGuestCountInput] = useState(String(route.guestCount));

  if (!hotel || hotel.status !== 'ACTIVE') {
    return <Empty title='Hotel nao encontrado' message='Selecione outro hotel.' />;
  }

  const guestCount = Math.max(1, Number.parseInt(guestCountInput, 10) || 1);
  const dateError = validateReservationWindow(checkInDate, checkOutDate);
  const availableRooms = dateError ? [] : getAvailableRoomsByHotel(hotel.id, checkInDate, checkOutDate, guestCount, reservations);

  return (
    <View style={styles.gap}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>MOB/RoomAvailability</Text>
        <Text style={styles.sub}>{hotel.name}</Text>
        <Input label='Check-in (AAAA-MM-DD)' value={checkInDate} onChange={setCheckInDate} placeholder={addDaysToToday(7)} />
        <Input label='Check-out (AAAA-MM-DD)' value={checkOutDate} onChange={setCheckOutDate} placeholder={addDaysToToday(10)} />
        <Input label='Hospedes' value={guestCountInput} onChange={setGuestCountInput} keyboardType='numeric' />
        {dateError ? <Text style={styles.error}>{dateError}</Text> : null}
      </View>

      {dateError ? <Empty title='Periodo invalido' message='Corrija as datas para continuar.' /> : availableRooms.length === 0 ? <Empty title='Sem disponibilidade' message='Nenhum quarto atende os filtros informados.' /> : availableRooms.map((room) => (
        <View key={room.id} style={styles.card}>
          <View style={styles.rowBetween}><Text style={styles.cardTitle}>{room.name}</Text><Tag text={`${room.availableUnits} disponiveis`} tone='success' /></View>
          <Text style={styles.body}>{room.description}</Text>
          <Text style={styles.sub}>Diaria {money(room.pricePerNight)} | Capacidade {room.capacity}</Text>
          <Button text='Reservar' tone='success' onPress={() => onSelectRoom(room.id, checkInDate, checkOutDate, guestCount)} />
        </View>
      ))}
    </View>
  );
}

function ProfileContent({ profile, onSave }: { profile: typeof initialProfile; onSave: (name: string, phone: string) => void; }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>MOB/Profile</Text>
      <Input label='Nome' value={name} onChange={setName} />
      <Input label='Email' value={profile.email} onChange={() => undefined} keyboardType='email-address' editable={false} />
      <Input label='Telefone' value={phone} onChange={setPhone} />
      <Button text='Salvar perfil' onPress={() => onSave(name, phone)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral900 },
  container: { flex: 1, backgroundColor: colors.page },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, backgroundColor: colors.neutral900, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  headerTitle: { color: colors.white, fontSize: 16, fontWeight: '800' },
  notice: { marginHorizontal: spacing.md, marginTop: spacing.sm, backgroundColor: colors.success, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  noticeText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.lg },
  gap: { gap: spacing.md },
  card: { borderWidth: 1, borderColor: colors.neutral300, borderRadius: radius.md, backgroundColor: colors.white, padding: spacing.md, gap: spacing.xs },
  hero: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  heroTag: { color: colors.white, fontSize: 12, fontWeight: '700' },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '900' },
  heroText: { color: colors.white, fontSize: 14, lineHeight: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  sectionTitle: { color: colors.neutral900, fontSize: 16, fontWeight: '800' },
  cardTitle: { color: colors.neutral900, fontSize: 15, fontWeight: '800', flexShrink: 1 },
  body: { color: colors.neutral900, fontSize: 14, lineHeight: 20 },
  sub: { color: colors.neutral700, fontSize: 13, lineHeight: 18 },
  total: { color: colors.neutral900, fontSize: 17, fontWeight: '900' },
  locked: { color: colors.neutral500, fontSize: 12, fontWeight: '600' },
  error: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  inputWrap: { gap: spacing.xxs },
  inputLabel: { color: colors.neutral700, fontSize: 12, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: colors.neutral300, borderRadius: radius.sm, backgroundColor: colors.white, color: colors.neutral900, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, fontSize: 14 },
  inputReadonly: { backgroundColor: colors.neutral100, color: colors.neutral500 },
  button: { borderRadius: radius.sm, minHeight: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSuccess: { backgroundColor: colors.success },
  buttonNeutral: { backgroundColor: colors.neutral100, borderWidth: 1, borderColor: colors.neutral300 },
  buttonPressed: { opacity: 0.9 },
  buttonText: { fontSize: 14, fontWeight: '800' },
  buttonTextSolid: { color: colors.white },
  buttonTextNeutral: { color: colors.neutral900 },
  tag: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs },
  tagNeutral: { backgroundColor: colors.neutral100 },
  tagSuccess: { backgroundColor: 'rgba(22,163,74,0.18)' },
  tagDanger: { backgroundColor: 'rgba(220,38,38,0.18)' },
  tagText: { color: colors.neutral900, fontSize: 11, fontWeight: '700' },
  nav: { flexDirection: 'row', gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.neutral300, backgroundColor: colors.white, padding: spacing.sm },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.neutral100 },
  navItemActive: { backgroundColor: colors.pageAccent, borderWidth: 1, borderColor: 'rgba(22,163,74,0.4)' },
  navText: { color: colors.neutral700, fontSize: 12, fontWeight: '700' },
  navTextActive: { color: colors.successDark },
});
