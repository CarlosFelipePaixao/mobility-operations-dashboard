import './styles/main.css';
import { getRides } from './api/mobilityApi';
import type { Ride, RideStatus, RideType } from './types/ride';
import { formatCurrency, formatDateTime } from './utils/formatters';

const app = document.querySelector<HTMLDivElement>('#app');

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

function renderDashboard(rides: Ride[]): string {
  const total = rides.length;
  const inProgress = rides.filter((ride) => ride.status === 'in_progress').length;
  const completed = rides.filter((ride) => ride.status === 'completed').length;
  const cancelled = rides.filter((ride) => ride.status === 'cancelled').length;

  return `
    <section class="dashboard-grid">
      <article class="metric-card">
        <span>Total de operações</span>
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
        <span>Canceladas</span>
        <strong>${cancelled}</strong>
      </article>
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
    </article>
  `;
}

function renderApp(rides: Ride[]): void {
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

      ${renderDashboard(rides)}

      <section class="section-header">
        <div>
          <span class="eyebrow">Operações recentes</span>
          <h2>Corridas e entregas</h2>
        </div>
      </section>

      <section class="rides-list">
        ${rides.map(renderRideCard).join('')}
      </section>
    </main>
  `;
}

async function init(): Promise<void> {
  if (!app) return;

  app.innerHTML = `
    <main class="page">
      <p class="loading">Carregando operações...</p>
    </main>
  `;

  try {
    const rides = await getRides();
    renderApp(rides);
  } catch (error) {
    app.innerHTML = `
      <main class="page">
        <p class="error">Não foi possível carregar os dados.</p>
      </main>
    `;
  }
}

init();