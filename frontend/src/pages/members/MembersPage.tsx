import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Switch,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import memberService from "../../services/memberService";
import MemberFormModal from "./components/MemberFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { MemberResponse, CreateMemberRequest, UpdateMemberRequest } from "../../types";

export function MembersPage() {
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal & Confirm State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<MemberResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberResponse | null>(null);

  const loadMembers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await memberService.getMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
      setErrorMessage("Erro ao carregar lista de membros. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const activeMembersCount = members.filter((m) => m.active !== false).length;
  const isLimitReached = activeMembersCount >= 2;

  const handleOpenCreateModal = () => {
    if (isLimitReached) return;
    setSelectedMember(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (member: MemberResponse) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleSaveMember = async (
    formData: CreateMemberRequest | UpdateMemberRequest,
    memberId?: string | null
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const idToUpdate = memberId || selectedMember?._id || selectedMember?.id;
      if (idToUpdate) {
        await memberService.updateMember(idToUpdate, formData as UpdateMemberRequest);
      } else {
        await memberService.createMember(formData as CreateMemberRequest);
      }
      await loadMembers();
    } catch (error: any) {
      console.error("Error saving member:", error);
      const apiMessage = error.response?.data?.message || "Ocorreu um erro ao salvar o membro.";
      setErrorMessage(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (member: MemberResponse) => {
    try {
      const mId = member._id || member.id;
      if (mId) {
        await memberService.updateMember(mId, { active: !member.active });
        await loadMembers();
      }
    } catch (error) {
      console.error("Failed to toggle member active status:", error);
    }
  };

  const handleOpenDeleteConfirm = (member: MemberResponse) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const mId = memberToDelete?._id || memberToDelete?.id;
    if (mId) {
      try {
        await memberService.deleteMember(mId);
        await loadMembers();
      } catch (error) {
        console.error("Failed to delete member:", error);
      }
    }
    setDeleteConfirmOpen(false);
    setMemberToDelete(null);
  };

  if (isLoading && members.length === 0) {
    return (
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Membros da Conta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os membros cadastrados na conta (máximo 2 membros: você + parceiro/cônjuge)
          </Typography>
        </Box>
        <Tooltip title={isLimitReached ? "Limite máximo de 2 membros por conta atingido." : ""}>
          <span>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              disabled={isLimitReached}
              sx={{ fontWeight: 600, textTransform: "none", borderRadius: 2 }}
            >
              Novo Membro
            </Button>
          </span>
        </Tooltip>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {isLimitReached && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          Você atingiu o limite de 2 membros cadastrados para esta conta. A visão mensal está organizada em <strong>modo casal</strong> com colunas lado a lado.
        </Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E0E0E0" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nome do Membro</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tag de Cor</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Status Ativo
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => {
              const mId = member._id || member.id || "";
              return (
                <TableRow key={mId} sx={{ "&:hover": { backgroundColor: "#F9F9F9" } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {member.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={member.name}
                      size="small"
                      sx={{
                        backgroundColor: (member.color || "#1976D2") + "22",
                        color: member.color || "#1976D2",
                        borderColor: member.color || "#1976D2",
                        fontWeight: 600,
                        borderRadius: 1.5,
                        border: "1px solid",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Switch
                      checked={member.active !== false}
                      onChange={() => handleToggleActive(member)}
                      size="small"
                      color="primary"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Tooltip title="Editar membro">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(member)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir membro">
                        <IconButton size="small" color="warning" onClick={() => handleOpenDeleteConfirm(member)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Form Modal */}
      <MemberFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveMember as (formData: CreateMemberRequest | UpdateMemberRequest, memberId?: string | null) => Promise<void>}
        initialData={selectedMember}
        isSubmitting={isSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Excluir Membro?"
        message={`Tem certeza que deseja excluir o membro "${memberToDelete?.name}"?`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDangerous={true}
      />
    </Box>
  );
}

export default MembersPage;
