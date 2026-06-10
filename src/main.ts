import './styles/main.css';
import { getRides } from './api/mobilityApi';
import type { Ride, RideStatus, RideType } from './types/ride';
import { formatCurrency, formatDateTime } from './utils/formatters';

const app = document.querySelector<HTMLDivElement>('#app');

type StatusFilter = RideStatus | 'all';
type SortOption = 'newest' | 'oldest' | 'price_desc' | 'price_asc';

interface Filters {
  status: StatusFilter;
  city: string;
  searchTerm: string;
  sortBy: SortOption;
}

let allRides: Ride[] = [];

const filters: Filters = {
  status: 'all',
  city: 'all',
  searchTerm: '',
  sortBy: 'newest',
};

function getStatusLabel(status: RideStatus): string {
  const labels = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada',
  };

  return labels[status];
}

function getTypeLabel(type: RideType): string {
  const labels = {
    ride: 'Corrida',
    delivery: 'Entrega',
  };

  return labels[type];
}

function getUniqueCities(rides: Ride[]): string[] {
  const cities = rides.map((ride) => ride.city);
  return [...new Set(cities)].sort();
}

function getFilteredRides(): Ride[] {
  let filteredRides = [...allRides];

  if (filters.status !== 'all') {
    filteredRides = filteredRides.filter((ride) => ride.status === filters.status);
  }

  if (filters.city !== 'all') {
    filteredRides = filteredRides.filter((ride) => ride.city === filters.city);
  }

  if (filters.searchTerm.trim()) {
    const search = filters.searchTerm.toLowerCase().trim();

    filteredRides = filteredRides.filter((ride) => {
      return (
        ride.driver.toLowerCase().includes(search) ||
        ride.customer.toLowerCase().includes(search) ||
        ride.origin.toLowerCase().includes(search) ||
        ride.destination.toLowerCase().includes(search)
      );
    });
  }

  filteredRides.sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (filters.sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (filters.sortBy === 'price_desc') {
      return b.price - a.price;
    }

    return a.price - b.price;
  });

  return filteredRides;
}

function renderDashboard(rides: Ride[]): string {
  const total = rides.length;
  const inProgress = rides.filter((ride) => ride.status === 'in_progress').length;
  const completed = rides.filter((ride) => ride.status === 'completed').length;

  const totalRevenue = rides.reduce((sum, ride) => sum + ride.price, 0);
  const averageTicket = total > 0 ? totalRevenue / total : 0;

  const totalDistance = rides.reduce((sum, ride) => sum + ride.distanceKm, 0);
  const averageDistance = total > 0 ? totalDistance / total : 0;

  return `
    <section class="dashboard-grid">
      <article class="metric-card">
        <span>Resultados encontrados</span>
        <strong>${total}</strong>
      </article>

      <article class="metric-card">
        <span>Em andamento</span>
        <strong>${inProgress}</strong>
      </article>

      <article class="metric-card">
        <span>Concluídas</span>
        <strong>${completed}</strong>
      </article>

      <article class="metric-card">
        <span>Receita estimada</span>
        <strong>${formatCurrency(totalRevenue)}</strong>
      </article>

      <article class="metric-card">
        <span>Ticket médio</span>
        <strong>${formatCurrency(averageTicket)}</strong>
      </article>

      <article class="metric-card">
        <span>Distância média</span>
        <strong>${averageDistance.toFixed(1)} km</strong>
      </article>
    </section>
  `;
}

function renderFilters(): string {
  const cities = getUniqueCities(allRides);

  return `
    <section class="filters-panel" aria-label="Filtros de operações">
      <div class="filter-field">
        <label for="searchInput">Buscar</label>
        <input
          id="searchInput"
          type="search"
          placeholder="Motorista, cliente ou rota"
          value="${filters.searchTerm}"
        />
      </div>

      <div class="filter-field">
        <label for="statusFilter">Status</label>
        <select id="statusFilter">
          <option value="all" ${filters.status === 'all' ? 'selected' : ''}>Todos</option>
          <option value="pending" ${filters.status === 'pending' ? 'selected' : ''}>Pendente</option>
          <option value="in_progress" ${filters.status === 'in_progress' ? 'selected' : ''}>Em andamento</option>
          <option value="completed" ${filters.status === 'completed' ? 'selected' : ''}>Concluída</option>
          <option value="cancelled" ${filters.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
        </select>
      </div>

      <div class="filter-field">
        <label for="cityFilter">Cidade</label>
        <select id="cityFilter">
          <option value="all" ${filters.city === 'all' ? 'selected' : ''}>Todas</option>
          ${cities
      .map(
        (city) => `
                <option value="${city}" ${filters.city === city ? 'selected' : ''}>
                  ${city}
                </option>
              `,
      )
      .join('')}
        </select>
      </div>

      <div class="filter-field">
        <label for="sortFilter">Ordenar por</label>
        <select id="sortFilter">
          <option value="newest" ${filters.sortBy === 'newest' ? 'selected' : ''}>Mais recentes</option>
          <option value="oldest" ${filters.sortBy === 'oldest' ? 'selected' : ''}>Mais antigas</option>
          <option value="price_desc" ${filters.sortBy === 'price_desc' ? 'selected' : ''}>Maior valor</option>
          <option value="price_asc" ${filters.sortBy === 'price_asc' ? 'selected' : ''}>Menor valor</option>
        </select>
      </div>
    </section>
  `;
}

function renderRideCard(ride: Ride): string {
  return `
    <article class="ride-card">
      <div class="ride-card__header">
        <div>
          <span class="ride-card__type">${getTypeLabel(ride.type)}</span>
          <h3>${ride.origin} → ${ride.destination}</h3>
        </div>

        <span class="status status--${ride.status}">
          ${getStatusLabel(ride.status)}
        </span>
      </div>

      <div class="ride-card__body">
        <p><strong>Cidade:</strong> ${ride.city}</p>
        <p><strong>Motorista:</strong> ${ride.driver}</p>
        <p><strong>Cliente:</strong> ${ride.customer}</p>
        <p><strong>Distância:</strong> ${ride.distanceKm} km</p>
        <p><strong>Valor:</strong> ${formatCurrency(ride.price)}</p>
        <p><strong>Horário:</strong> ${formatDateTime(ride.createdAt)}</p>
      </div>

      <div class="ride-card__footer">
        <button class="details-button" data-ride-id="${ride.id}">
          Ver detalhes
        </button>
      </div>
    </article>
  `;
}

function renderRideDetails(ride: Ride): string {
  return `
    <div class="details-overlay" id="detailsOverlay">
      <aside class="details-panel" aria-label="Detalhes da operação">
        <div class="details-panel__header">
          <div>
            <span class="eyebrow">${getTypeLabel(ride.type)}</span>
            <h2>${ride.origin} → ${ride.destination}</h2>
          </div>

          <button class="details-close-button" id="closeDetailsButton" aria-label="Fechar detalhes">
            ×
          </button>
        </div>

        <span class="status status--${ride.status}">
          ${getStatusLabel(ride.status)}
        </span>

        <div class="details-grid">
          <div class="details-item">
            <span>Cidade</span>
            <strong>${ride.city}</strong>
          </div>

          <div class="details-item">
            <span>Motorista</span>
            <strong>${ride.driver}</strong>
          </div>

          <div class="details-item">
            <span>Cliente</span>
            <strong>${ride.customer}</strong>
          </div>

          <div class="details-item">
            <span>Origem</span>
            <strong>${ride.origin}</strong>
          </div>

          <div class="details-item">
            <span>Destino</span>
            <strong>${ride.destination}</strong>
          </div>

          <div class="details-item">
            <span>Distância</span>
            <strong>${ride.distanceKm} km</strong>
          </div>

          <div class="details-item">
            <span>Valor</span>
            <strong>${formatCurrency(ride.price)}</strong>
          </div>

          <div class="details-item">
            <span>Horário</span>
            <strong>${formatDateTime(ride.createdAt)}</strong>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function openRideDetails(rideId: number): void {
  const ride = allRides.find((item) => item.id === rideId);

  if (!ride) return;

  const existingOverlay = document.querySelector('#detailsOverlay');
  existingOverlay?.remove();

  document.body.insertAdjacentHTML('beforeend', renderRideDetails(ride));

  const closeButton = document.querySelector<HTMLButtonElement>('#closeDetailsButton');
  const overlay = document.querySelector<HTMLDivElement>('#detailsOverlay');

  closeButton?.addEventListener('click', closeRideDetails);

  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeRideDetails();
    }
  });
}

function closeRideDetails(): void {
  const overlay = document.querySelector('#detailsOverlay');
  overlay?.remove();
}

function setupDetailsEvents(): void {
  const ridesList = document.querySelector<HTMLElement>('#ridesList');

  ridesList?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('.details-button');

    if (!button) return;

    const rideId = Number(button.dataset.rideId);
    openRideDetails(rideId);
  });
}

function renderEmptyState(): string {
  return `
    <article class="empty-state">
      <h3>Nenhuma operação encontrada</h3>
      <p>Tente alterar os filtros, buscar outro motorista, cliente ou rota.</p>
    </article>
  `;
}

function updateResults(): void {
  const dashboardContainer = document.querySelector<HTMLDivElement>('#dashboardContainer');
  const resultsCount = document.querySelector<HTMLSpanElement>('#resultsCount');
  const ridesList = document.querySelector<HTMLElement>('#ridesList');

  const filteredRides = getFilteredRides();

  if (dashboardContainer) {
    dashboardContainer.innerHTML = renderDashboard(filteredRides);
  }

  if (resultsCount) {
    const label = filteredRides.length === 1 ? 'resultado' : 'resultados';
    resultsCount.textContent = `${filteredRides.length} ${label}`;
  }

  if (ridesList) {
    ridesList.innerHTML = filteredRides.length
      ? filteredRides.map(renderRideCard).join('')
      : renderEmptyState();
  }
}

function setupFilterEvents(): void {
  const searchInput = document.querySelector<HTMLInputElement>('#searchInput');
  const statusFilter = document.querySelector<HTMLSelectElement>('#statusFilter');
  const cityFilter = document.querySelector<HTMLSelectElement>('#cityFilter');
  const sortFilter = document.querySelector<HTMLSelectElement>('#sortFilter');

  searchInput?.addEventListener('input', (event) => {
    filters.searchTerm = (event.target as HTMLInputElement).value;
    updateResults();
  });

  statusFilter?.addEventListener('change', (event) => {
    filters.status = (event.target as HTMLSelectElement).value as StatusFilter;
    updateResults();
  });

  cityFilter?.addEventListener('change', (event) => {
    filters.city = (event.target as HTMLSelectElement).value;
    updateResults();
  });

  sortFilter?.addEventListener('change', (event) => {
    filters.sortBy = (event.target as HTMLSelectElement).value as SortOption;
    updateResults();
  });
}

function renderApp(): void {
  if (!app) return;

  app.innerHTML = `
    <main class="page">
      <section class="hero">
        <div>
          <span class="eyebrow">Mobility Operations</span>
          <h1>Dashboard de Operações Urbanas</h1>
          <p>
            Acompanhe corridas, entregas, motoristas e indicadores de operação
            em uma interface responsiva construída com TypeScript e CSS puro.
          </p>
        </div>
      </section>

      <div id="dashboardContainer"></div>

      ${renderFilters()}

      <section class="section-header section-header--with-result">
        <div>
          <span class="eyebrow">Operações recentes</span>
          <h2>Corridas e entregas</h2>
        </div>

        <span id="resultsCount" class="results-count"></span>
      </section>

      <section id="ridesList" class="rides-list"></section>
    </main>
  `;

  setupFilterEvents();
  setupDetailsEvents();
  updateResults();
}

async function init(): Promise<void> {
  if (!app) return;

  app.innerHTML = `
    <main class="page">
      <p class="loading">Carregando operações...</p>
    </main>
  `;

  try {
    allRides = await getRides();
    renderApp();
  } catch (error) {
    app.innerHTML = `
      <main class="page">
        <p class="error">Não foi possível carregar os dados.</p>
      </main>
    `;
  }
}

init();