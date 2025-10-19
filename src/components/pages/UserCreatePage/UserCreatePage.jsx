import React, { useState } from 'react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const ROLES = [
  { value: 'jefe', label: 'Jefe' },
  { value: 'administrador', label: 'Administrador' },
  { value: 'vendedor', label: 'Vendedor' }
];

const validateEmail = email => /\S+@\S+\.\S+/.test(email);
const validateUsername = username => /^[a-zA-Z0-9_]+$/.test(username);

const UserCreatePage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    role: 'vendedor'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.username || !validateUsername(form.username)) return 'Usuario inválido (solo letras, números y guiones bajos)';
    if (!form.email || !validateEmail(form.email)) return 'Email inválido';
    if (!form.password || form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (!form.firstName) return 'Nombre requerido';
    if (!form.lastName) return 'Apellido requerido';
    if (!form.phone) return 'Teléfono requerido';
    if (!form.role) return 'Rol requerido';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Aquí deberías obtener el token del usuario actual si es admin
      // y decidir el endpoint según el rol actual
      // Ejemplo: POST /api/users para admin, /api/auth/register para público
      const endpoint = '/api/users';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // si es admin
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Usuario creado correctamente');
        setForm({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          position: '',
          role: 'vendedor'
        });
      } else {
        setError(data.message || 'Error al crear usuario');
      }
    } catch (err) {
      setError('Error de red o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Usuario" name="username" value={form.username} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
        <Input label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} required />
        <Input label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} required />
        <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} required />
        <Input label="Cargo (opcional)" name="position" value={form.position} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creando...' : 'Crear Usuario'}</Button>
      </form>
    </div>
  );
};

export default UserCreatePage;
