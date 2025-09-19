import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EntityState, Entity } from '../../../types/entity';
import { fetchEntities, createEntity, updateEntity, assignMainUser } from './thunks';

const initialState: EntityState = {
  entities: [],
  isLoading: false,
  error: null,
  selectedEntity: null,
};

const entitySlice = createSlice({
  name: 'entity',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedEntity: (state, action: PayloadAction<Entity | null>) => {
      state.selectedEntity = action.payload;
    },
    clearSelectedEntity: (state) => {
      state.selectedEntity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch entities
      .addCase(fetchEntities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities = action.payload;
        state.error = null;
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch entities';
      })
      
      // Create entity
      .addCase(createEntity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEntity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities.push(action.payload);
        state.error = null;
      })
      .addCase(createEntity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create entity';
      })
      
      // Update entity
      .addCase(updateEntity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEntity.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.entities.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEntity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update entity';
      })
      
      // Assign main user
      .addCase(assignMainUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignMainUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.entities.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(assignMainUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to assign main user';
      });
  },
});

export const { clearError, setSelectedEntity, clearSelectedEntity } = entitySlice.actions;

// Selectors
export const selectAllEntities = (state: { entity: EntityState }) => state.entity.entities;
export const selectActiveEntities = (state: { entity: EntityState }) => 
  state.entity.entities.filter(entity => entity.is_active);
export const selectEntityById = (state: { entity: EntityState }, id: string) => 
  state.entity.entities.find(entity => entity.id === id);
export const selectEntityBySlug = (state: { entity: EntityState }, id: string) => 
  state.entity.entities.find(entity => entity.id === id);
export const selectEntitiesWithMainUsers = (state: { entity: EntityState }) => 
  state.entity.entities.filter(entity => entity.main_user !== null);
export const selectSelectedEntity = (state: { entity: EntityState }) => state.entity.selectedEntity;
export const selectEntityLoading = (state: { entity: EntityState }) => state.entity.isLoading;
export const selectEntityError = (state: { entity: EntityState }) => state.entity.error;

export default entitySlice.reducer;
