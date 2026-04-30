'use client';

import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { FieldType } from '@/modules/shared/domain/entities/dynamic-fields';

interface TempUserFieldsManagerProps {
  dynamicFields: Record<string, any>;
  onFieldsChange: (fields: Record<string, any>) => void;
}

interface TempField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  value: any;
  required?: boolean;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Ãrea de texto' },
  { value: 'number', label: 'NÃºmero' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'TelÃ©fono' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'SelecciÃ³n' },
  { value: 'checkbox', label: 'Casilla de verificaciÃ³n' },
];

export function TempUserFieldsManager({
  dynamicFields,
  onFieldsChange,
}: TempUserFieldsManagerProps) {
  const [fields, setFields] = useState<TempField[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingField, setEditingField] = useState<TempField | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    type: 'text' as FieldType,
    required: false,
  });

  const handleOpenForm = (field?: TempField) => {
    if (field) {
      setEditingField(field);
      setFormData({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required || false,
      });
    } else {
      setEditingField(null);
      setFormData({
        name: '',
        label: '',
        type: 'text',
        required: false,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingField(null);
    setFormData({
      name: '',
      label: '',
      type: 'text',
      required: false,
    });
  };

  const handleSaveField = () => {
    if (!formData.name || !formData.label) return;

    const newField: TempField = {
      id: editingField?.id || `temp_${Date.now()}`,
      name: formData.name,
      label: formData.label,
      type: formData.type,
      value: '',
      required: formData.required,
    };

    let updatedFields: TempField[];
    if (editingField) {
      updatedFields = fields.map((f) => (f.id === editingField.id ? newField : f));
    } else {
      updatedFields = [...fields, newField];
    }

    setFields(updatedFields);

    // Actualizar los campos dinÃ¡micos en el componente padre
    const fieldsObject = updatedFields.reduce(
      (acc, field) => {
        acc[field.name] = field.value;
        return acc;
      },
      {} as Record<string, any>
    );

    onFieldsChange(fieldsObject);
    handleCloseForm();
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = fields.filter((f) => f.id !== fieldId);
    setFields(updatedFields);

    // Actualizar los campos dinÃ¡micos en el componente padre
    const fieldsObject = updatedFields.reduce(
      (acc, field) => {
        acc[field.name] = field.value;
        return acc;
      },
      {} as Record<string, any>
    );

    onFieldsChange(fieldsObject);
  };

  const handleFieldValueChange = (fieldId: string, value: any) => {
    const updatedFields = fields.map((f) => (f.id === fieldId ? { ...f, value } : f));
    setFields(updatedFields);

    // Actualizar los campos dinÃ¡micos en el componente padre
    const fieldsObject = updatedFields.reduce(
      (acc, field) => {
        acc[field.name] = field.value;
        return acc;
      },
      {} as Record<string, any>
    );

    onFieldsChange(fieldsObject);
  };

  const renderFieldInput = (field: TempField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={field.value || ''}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            value={field.value || ''}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
          />
        );
      case 'email':
        return (
          <TextField
            fullWidth
            type="email"
            value={field.value || ''}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
          />
        );
      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            value={field.value || ''}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'checkbox':
        return (
          <FormControl fullWidth>
            <Select
              value={(field.value === true ? 'true' : field.value === false ? 'false' : '')}
              onChange={(e) => handleFieldValueChange(field.id, (e.target.value as string) === 'true')}
            >
              <MenuItem value="true">SÃ­</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            fullWidth
            value={field.value || ''}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Campos DinÃ¡micos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Agregar Campo
        </Button>
      </Stack>

      {fields.length === 0 ? (
        <Alert severity="info">
          No hay campos dinÃ¡micos configurados. Haga clic en "Agregar Campo" para crear uno.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {fields.map((field) => (
            <Card key={field.id} variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {field.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {field.name} â€¢ {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                      {field.required && ' â€¢ Requerido'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenForm(field)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteField(field.id)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </Stack>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Valor:
                  </Typography>
                  {renderFieldInput(field)}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* DiÃ¡logo para crear/editar campo */}
      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingField ? 'Editar Campo' : 'Crear Campo'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nombre del campo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ej: telefono_emergencia"
            />
            <TextField
              fullWidth
              label="Etiqueta"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="ej: TelÃ©fono de Emergencia"
            />
            <FormControl fullWidth>
              <InputLabel>Tipo de campo</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as FieldType })}
                label="Tipo de campo"
              >
                {FIELD_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button
            onClick={handleSaveField}
            variant="contained"
            disabled={!formData.name || !formData.label}
          >
            {editingField ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
