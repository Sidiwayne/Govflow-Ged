import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { Courrier, DataAnnoter, DataArchiver, DataCloturer, DataJoindreDocument, DataRejeter, DataRépondre, DataTransmettre, DataValider } from '../types/courrier';

interface NodeHistoryItem {
  id: string;
  nodeId: string;
  entity: string;
  user: string;
  arrivalDate: Date;
  status: string;
  actions: Array<{
    id: string;
    type: string;
    name: string;
    description: string;
    date: Date;
    authorId: string;
  }>;
}

interface CourrierHistoryProps {
  courrier: Courrier;
}

const CourrierHistory: React.FC<CourrierHistoryProps> = ({ courrier }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'terminé':
        return 'success';
      case 'en cours':
        return 'warning';
      case 'en attente':
        return 'info';
      case 'bloqué':
        return 'error';
      default:
        return 'default';
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Construire l'historique basé sur les nodes
  const nodeHistory = useMemo(() => {
    if (!courrier) return [];

    const nodeItems: NodeHistoryItem[] = courrier.nodes.map((node, nodeIndex) => {
      // Traiter les actions du node
      const processedActions = node.actions.map(action => {
        let actionDescription = '';
        let actionName = '';

        switch (action.type) {
          case 'annoter':
            actionName = 'Annotation';
            actionDescription = (action.data as DataAnnoter).note || 'Note ajoutée';
            break;
          case 'transmettre':
            actionName = 'Transmission';
            const targets = (action.data as DataTransmettre).targets || [];
            actionDescription = `Transmis à ${targets.map(t => t.entity).join(', ')}`;
            if ((action.data as DataTransmettre).message) {
              actionDescription += ` - ${(action.data as DataTransmettre).message}`;
            }
            break;
          case 'valider':
            actionName = 'Validation';
            actionDescription = (action.data as DataValider).comment || 'Courrier validé';
            break;
          case 'joindre_document':
            actionName = 'Document';
            const docCount = (action.data as DataJoindreDocument).documents?.length || 0;
            actionDescription = `${docCount} document(s) joint(s)`;
            break;
          case 'rejeter':
            actionName = 'Rejet';
            actionDescription = (action.data as DataRejeter).reason || 'Courrier rejeté';
            break;
          case 'répondre':
            actionName = 'Réponse';
            actionDescription = (action.data as DataRépondre).content || 'Réponse envoyée';
            break;
          case 'cloturer':
            actionName = 'Clôture';
            actionDescription = (action.data as DataCloturer).comment || 'Courrier clôturé';
            break;
          case 'archiver':
            actionName = 'Archivage';
            actionDescription = (action.data as DataArchiver).comment || 'Courrier archivé';
            break;
          default:
            actionName = 'Action';
            actionDescription = `Action ${action.type} effectuée`;
        }

        return {
          id: action.id,
          type: action.type,
          name: actionName,
          description: actionDescription,
          date: new Date(action.date),
          authorId: action.authorId,
        };
      });

      return {
        id: `node-${node.id}`,
        nodeId: node.id,
        entity: node.entityName || 'Entité inconnue',
        user: node.userFullName || `Utilisateur ${node.userId}`,
        arrivalDate: new Date(node.arrivalDate),
        status: node.status === 'active' ? 'En cours' : 'Terminé',
        actions: processedActions,
      };
    });

    // Trier par date d'arrivée (plus récent en premier)
    return nodeItems.sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
  }, [courrier]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Historique du Suivi
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Timeline position="right">
          {nodeHistory.map((node, index) => {
            const isExpanded = expandedItems.has(node.id);
            return (
              <TimelineItem key={node.id}>
                <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                  <Typography variant="body2" color="text.secondary">
                    {node.arrivalDate.toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot 
                    color={getStatusColor(node.status) as any}
                    variant={index === nodeHistory.length - 1 ? 'filled' : 'outlined'}
                  />
                  {index < nodeHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                        {node.entity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {node.user} • {node.status}
                      </Typography>
                      {node.actions.length > 0 && (
                        <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                          {node.actions.length} action(s)
                        </Typography>
                      )}
                    </Box>
                    {node.actions.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={() => toggleExpanded(node.id)}
                        sx={{ ml: 1 }}
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </Box>
                  {isExpanded && node.actions.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Actions effectuées :
                      </Typography>
                      {node.actions.map((action, actionIndex) => (
                        <Box 
                          key={action.id} 
                          sx={{ 
                            mb: 1, 
                            p: 1, 
                            backgroundColor: 'grey.50', 
                            borderRadius: 1,
                            borderLeft: '3px solid',
                            borderLeftColor: 'primary.main'
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {action.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {action.date.toLocaleDateString('fr-FR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {action.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default CourrierHistory;
