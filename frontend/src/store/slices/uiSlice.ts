import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TicketFilterTab } from '../../types/ticket';

export interface UIState {
  filter: TicketFilterTab;
  activeNav: string;
  searchQuery: string;
  selectedTicketId: string | null;
  isCreateModalOpen: boolean;
  isKnowledgeBaseOpen: boolean;
  isContactModalOpen: boolean;
  isMobileSidebarOpen: boolean;
}

const initialState: UIState = {
  filter: 'all',
  activeNav: 'home',
  searchQuery: '',
  selectedTicketId: null,
  isCreateModalOpen: false,
  isKnowledgeBaseOpen: false,
  isContactModalOpen: false,
  isMobileSidebarOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TicketFilterTab>) => {
      state.filter = action.payload;
    },
    setActiveNav: (state, action: PayloadAction<string>) => {
      state.activeNav = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTicketId: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
    },
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    openKnowledgeBase: (state) => {
      state.isKnowledgeBaseOpen = true;
    },
    closeKnowledgeBase: (state) => {
      state.isKnowledgeBaseOpen = false;
    },
    openContactModal: (state) => {
      state.isContactModalOpen = true;
    },
    closeContactModal: (state) => {
      state.isContactModalOpen = false;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },
  },
});

export const {
  setFilter,
  setActiveNav,
  setSearchQuery,
  setSelectedTicketId,
  openCreateModal,
  closeCreateModal,
  openKnowledgeBase,
  closeKnowledgeBase,
  openContactModal,
  closeContactModal,
  toggleMobileSidebar,
  closeMobileSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
