import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Stack,
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
  Close,
  Description,
  Person,
  Schedule,
  PriorityHigh,
  Security,
  Label,
  AccountTree,
  CloudUpload,
  Visibility,
  Download,
  ZoomIn,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import PDFPreview from './PDFPreview';
import { Action, Courrier, DataAnnoter, DataArchiver, DataCloturer, DataDocument, DataJoindreDocument, DataRejeter, DataRépondre, DataTransmettre, DataValider } from '../types/courrier';

interface CourrierDetailProps {
  open: boolean;
  onClose: () => void;
  courrier: Courrier | null;
}

interface HistoriqueAction {
  id: string;
  action: string;
  description: string;
  date: Date;
  utilisateur: string;
  entite: string;
  statut: string;
}

const CourrierDetail: React.FC<CourrierDetailProps> = ({ open, onClose, courrier }) => {
  const [previewFile, setPreviewFile] = useState<DataDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const documents = useMemo(() => {
    return courrier?.nodes
      .reduce((acc: DataDocument[], node) => {
        const documents = node.actions.filter(({type}) => type === 'joindre_document').map(({data}) => (data as DataJoindreDocument).documents);
        return [...acc, ...documents.flat()];
      }, [])
 
  }, [courrier]);

  // Construire l'historique à partir des nodes et actions du courrier
  const historique = useMemo(() => {
    if (!courrier) return [];

    const historyItems: HistoriqueAction[] = [];

    // Parcourir tous les nodes du courrier
    courrier.nodes.forEach((node, nodeIndex) => {
      // Ajouter l'arrivée du courrier au node
      historyItems.push({
        id: `node-${node.id}-arrival`,
        action: nodeIndex === 0 ? 'Création' : 'Réception',
        description: nodeIndex === 0 
          ? 'Courrier créé et enregistré' 
          : `Reçu par l'entité ${node.entityName}`,
        date: new Date(node.arrivalDate),
        utilisateur: `${node.userFullName}`,
        entite: node.entityName!,
        statut: node.status === 'active' ? 'En cours' : 'Terminé'
      });

      // Parcourir toutes les actions du node
      node.actions.forEach((action, actionIndex) => {
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

        historyItems.push({
          id: `action-${action.id}`,
          action: actionName,
          description: actionDescription,
          date: new Date(action.date),
          utilisateur: `Utilisateur ${action.authorId}`,
          entite: node.entityName!,
          statut: node.status === 'active' ? 'En cours' : 'Terminé'
        });
      });

      // Ajouter la clôture du node si applicable
      if (node.status === 'closed' && node.closeDate) {
        historyItems.push({
          id: `node-${node.id}-close`,
          action: 'Clôture',
          description: `Node clôturé dans l'entité ${node.entityName!}`,
          date: new Date(node.closeDate),
          utilisateur: `Utilisateur ${node.userId}`,
          entite: node.entityName!,
          statut: 'Terminé'
        });
      }
    });

    // Trier par date (plus récent en premier)
    return historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [courrier]);
  
  if (!courrier) return null;

  console.log('documents', documents);
  console.log('historique', historique);

  const getStatusColor = (statut: string) => {
    switch (statut.toLowerCase()) {
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

  const getPriorityColor = (priorite: string) => {
    switch (priorite.toLowerCase()) {
      case 'urgente':
        return 'error';
      case 'haute':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getConfidentialityColor = (confidentialite: string) => {
    switch (confidentialite.toLowerCase()) {
      case 'secret':
        return 'error';
      case 'confidentiel':
        return 'warning';
      case 'interne':
        return 'info';
      default:
        return 'default';
    }
  };

  const handlePreviewFile = (file: DataDocument) => {
    setPreviewFile(file);
    setPreviewOpen(true);
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

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: { height: '90vh' }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Détail du Courrier
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* En-tête */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid size={{xs: 12, md: 8}}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                      {courrier.metadata.objet}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={courrier.status}
                        color={getStatusColor(courrier.status)}
                        variant="outlined"
                      />
                      {/* <Chip
                        label={courrier.destinationEntity}
                        color="primary"
                        variant="outlined"
                      /> */}
                    </Box>
                  </Grid>
                  <Grid size={{xs: 12, md: 4}}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Référence
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                        {courrier.number}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              {/* Colonne gauche - Métadonnées et Documents */}
              <Grid size={{xs: 12, md: 8}}>
                {/* Métadonnées complètes */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description color="primary" />
                      Métadonnées
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                      <Grid size={{xs: 12, sm: 6}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Type de courrier
                          </Typography>
                          <Typography variant="body1">{courrier.type}</Typography>
                        </Box>
                      </Grid>

                      <Grid size={{xs: 12, sm: 6}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Canal de réception
                          </Typography>
                          <Typography variant="body1">{courrier.metadata.canalReception}</Typography>
                        </Box>
                      </Grid>

                      <Grid size={{xs: 12}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Expéditeur
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {courrier.metadata.expediteur}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{xs: 12, sm: 6}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Date de réception
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {new Date(courrier.metadata.dateReception).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{xs: 12, sm: 6}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Priorité
                          </Typography>
                          <Chip
                            label={courrier.metadata.priorite}
                            color={getPriorityColor(courrier.metadata.priorite)}
                            size="small"
                            icon={<PriorityHigh />}
                          />
                        </Box>
                      </Grid>

                      <Grid size={{xs: 12, sm: 6}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Confidentialité
                          </Typography>
                          <Chip
                            label={courrier.metadata.confidentialite || 'Non défini'}
                            color={getConfidentialityColor(courrier.metadata.confidentialite || '')}
                            size="small"
                            icon={<Security />}
                          />
                        </Box>
                      </Grid>
{/* 
                      <Grid size={{xs: 12, sm: 6}}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Entité destinataire
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountTree sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {courrier.destinationEntity}
                          </Typography>
                        </Box>
                      </Grid> */}

                      {courrier.metadata.referenceExterne && (
                        <Grid size={{xs: 12}}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Référence externe
                            </Typography>
                            <Typography variant="body1">{courrier.metadata.referenceExterne}</Typography>
                          </Box>
                        </Grid>
                      )}

                      {courrier.metadata.tags && courrier.metadata.tags.length > 0 && (
                        <Grid size={{xs: 12}}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Tags / Catégories
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {courrier.metadata.tags.map(tag => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                  icon={<Label />}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CloudUpload color="primary" />
                      Documents
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {documents && documents.length > 0 ? (
                      <Stack spacing={2}>
                        {documents.map((document, index) => (
                          <Paper key={index} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Description color="primary" sx={{ fontSize: 24 }} />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {document.filename}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Prévisualiser">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePreviewFile(document)}
                                >
                                  <ZoomIn />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Télécharger">
                                <IconButton size="small">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                        Aucun document attaché
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Note interne */}
                {/* {courrier.noteInitiale && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Visibility color="primary" />
                        Note interne
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        {courrier.noteInitiale}
                      </Typography>
                    </CardContent>
                  </Card>
                )} */}
              </Grid>

              {/* Colonne droite - Historique */}
              <Grid size={{xs: 12, md: 4}}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Historique du Suivi
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Timeline position="right">
                      {historique.map((action, index) => {
                        const isExpanded = expandedItems.has(action.id);
                        return (
                          <TimelineItem key={action.id}>
                            <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                              <Typography variant="body2" color="text.secondary">
                                {action.date.toLocaleDateString('fr-FR', { 
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
                                color={getStatusColor(action.statut) as any}
                                variant={index === historique.length - 1 ? 'filled' : 'outlined'}
                              />
                              {index < historique.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                    {action.action}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {action.entite} • {action.utilisateur}
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleExpanded(action.id)}
                                  sx={{ ml: 1 }}
                                >
                                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              </Box>
                              {isExpanded && (
                                <Box sx={{ mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {action.description}
                                  </Typography>
                                </Box>
                              )}
                            </TimelineContent>
                          </TimelineItem>
                        );
                      })}
                    </Timeline>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <PDFPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={previewFile}
      />
    </>
  );
};

export default CourrierDetail;
