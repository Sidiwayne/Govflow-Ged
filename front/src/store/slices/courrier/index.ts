import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Action, CourierState, Courrier, CourrierFlow } from "../../../types/courrier";
import { fetchCourriers, createCourrier, markNodeAsRead, createAction, createNode } from "./thunks";

const initialState: CourierState = {
    courriers: [],
    isLoading: false,
    error: null,
    selectedCourrier: null,
    filters: {},
  };
  
  const courrierSlice = createSlice({
    name: 'courrier',
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      setSelectedCourrier: (state, action: PayloadAction<Courrier | null>) => {
        state.selectedCourrier = action.payload;
      },
      clearSelectedCourrier: (state) => {
        state.selectedCourrier = null;
      },
      setFilters: (state, action: PayloadAction<Partial<CourierState['filters']>>) => {
        state.filters = { ...state.filters, ...action.payload };
      },
      clearFilters: (state) => {
        state.filters = {};
      },
      addActionToNode: (state, action: PayloadAction<{ courierId: string; nodeId: string; action: Action }>) => {
        const { courierId, nodeId, action: newAction } = action.payload;
        const courrier = state.courriers.find(c => c.id === courierId);
        if (courrier) {
          const node = courrier.nodes.find(n => n.id === nodeId);
          if (node) {
            node.actions.push(newAction);
          }
        }
      },
      updateNodeStatus: (state, action: PayloadAction<{ courierId: string; nodeId: string; status: 'active' | 'closed' }>) => {
        const { courierId, nodeId, status } = action.payload;
        const courrier = state.courriers.find(c => c.id === courierId);
        if (courrier) {
          const node = courrier.nodes.find(n => n.id === nodeId);
          if (node) {
            node.status = status;
            if (status === 'closed') {
              node.closeDate = new Date().toISOString();
            }
          }
        }
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch courriers
        .addCase(fetchCourriers.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchCourriers.fulfilled, (state, action) => {
          state.isLoading = false;
          state.courriers = action.payload;
          state.error = null;
        })
        .addCase(fetchCourriers.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to fetch courriers';
        })
        
        // Create courrier
        .addCase(createCourrier.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(createCourrier.fulfilled, (state, action) => {
          state.isLoading = false;
          state.courriers.push(action.payload);
          state.error = null;
        })
        .addCase(createCourrier.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to create courrier';
        })
        
        // Create action
        .addCase(createAction.fulfilled, (state, action) => {
          const { nodeId } = action.payload;
          const courrier = state.courriers.find(c => c.nodes.some(n => n.id === nodeId));
          if (courrier) {
            const node = courrier.nodes.find(n => n.id === nodeId);
            if (node) {
              node.actions.push(action.payload);
            }
          }
        })
        
        // Create node
        .addCase(createNode.fulfilled, (state, action) => {
          const { courierId } = action.payload;
          const courrier = state.courriers.find(c => c.id === courierId);
          if (courrier) {
            courrier.nodes.push(action.payload);
          }
        })
        
        // Mark node as read
        .addCase(markNodeAsRead.fulfilled, (state, action) => {
          const { courierId, nodeId } = action.payload;
          const courrier = state.courriers.find(c => c.id === courierId);
          if (courrier) {
            const node = courrier.nodes.find(n => n.id === nodeId);
            if (node) {
              node.lu = true;
            }
          }
        });
    },
  });
  
  export const { 
    clearError, 
    setSelectedCourrier, 
    clearSelectedCourrier, 
    setFilters, 
    clearFilters,
    addActionToNode,
    updateNodeStatus,
  } = courrierSlice.actions;
  
  // Selectors
  export const selectAllCourriersEntrants = (state: { courrier: CourierState }) => state.courrier.courriers.filter(courrier => courrier.flow === CourrierFlow.ENTRANT);
  export const selectAllCourriersSortants = (state: { courrier: CourierState }) => state.courrier.courriers.filter(courrier => courrier.flow === CourrierFlow.SORTANT);
  export const selectCourrierById = (state: { courrier: CourierState }, id: string) => 
    state.courrier.courriers.find(courrier => courrier.id === id);
  export const selectCourriersByType = (state: { courrier: CourierState }, type: 'entrant' | 'sortant') => 
    state.courrier.courriers.filter(courrier => courrier.type === type);  
  export const selectCourriersByStatus = (state: { courrier: CourierState }, status: 'in_progress' | 'closed' | 'archived') => 
    state.courrier.courriers.filter(courrier => courrier.status === status);
  export const selectActiveCourriers = (state: { courrier: CourierState }) => 
    state.courrier.courriers.filter(courrier => courrier.status === 'in_progress');
  export const selectCourriersByEntity = (state: { courrier: CourierState }, entity: string) => 
    state.courrier.courriers.filter(courrier => 
      courrier.nodes.some(node => node.entityId === entity && node.status === 'active')
    );
  export const selectUnreadCourriers = (state: { courrier: CourierState }) => 
    state.courrier.courriers.filter(courrier => 
      courrier.nodes.some(node => !node.lu && node.status === 'active')
    );
  export const selectSelectedCourrier = (state: { courrier: CourierState }) => state.courrier.selectedCourrier;
  export const selectCourrierFilters = (state: { courrier: CourierState }) => state.courrier.filters;
  export const selectCourrierLoading = (state: { courrier: CourierState }) => state.courrier.isLoading;
  export const selectCourrierError = (state: { courrier: CourierState }) => state.courrier.error;
  
  // Helper selectors
  export const selectActiveNode = (state: { courrier: CourierState }, courierId: string) => {
    const courrier = state.courrier.courriers.find(c => c.id === courierId);
    return courrier?.nodes.find(node => node.status === 'active');
  };
  
  export const selectNodeHistory = (state: { courrier: CourierState }, courierId: string) => {
    const courrier = state.courrier.courriers.find(c => c.id === courierId);
    return courrier?.nodes.filter(node => node.status === 'closed') || [];
  };
  
  export default courrierSlice.reducer;
  